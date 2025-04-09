/**
 * Utility function to convert a JSON schema into a config array for FormComposerV2
 * @param {Object} schema - JSON schema object
 * @param {Array} components - List of component names
 * @returns {Array} config - Configuration array for FormComposerV2
 */
export const schemaToConfig = (schema, components) => {
    if (!schema || !schema.properties) {
        throw new Error("Invalid schema: Schema or schema properties are missing");
    }

    const config = [];
    const properties = schema.properties;
    const requiredFields = schema.required || [];

    // Process each top-level property in the schema
    Object.keys(properties).forEach(propKey => {
        const property = properties[propKey];
        const isRequired = requiredFields.includes(propKey);

        // Handle object type properties as separate sections
        if (property.type === "object") {
            const section = createSection(propKey, property, isRequired, components);
            if (section.body.length > 0) {
                config.push(section);
            }
        }
        // Handle special case for array items
        else if (property.type === "array") {
            const section = createArraySection(propKey, property, isRequired);
            if (section) {
                config.push(section);
            }
        }
        // Group non-object properties by common parent
        else {
            let parentSection = config.find(section => section.key === "basicDetails");
            if (!parentSection) {
                parentSection = {
                    head: "Basic Details",
                    subHead: "",
                    key: "basicDetails",
                    body: []
                };
                config.push(parentSection);
            }

            const field = createField(propKey, property, isRequired);
            if (field) {
                parentSection.body.push(field);
            }
        }
    });

    return config;
};

/**
 * Creates a section for an object type property
 * @param {String} key - Property key 
 * @param {Object} property - Property schema
 * @param {Boolean} isParentRequired - Whether the parent object is required
 * @param {Array} components - List of component names
 * @returns {Object} Section configuration
 */
const createSection = (key, property, isParentRequired, components) => {
    const section = {
        head: getHeadingFromKey(key),
        subHead: property.description || "",
        key,
        body: []
    };

    // Process nested properties
    if (property.properties) {
        Object.keys(property.properties).forEach(nestedKey => {
            const nestedProp = property.properties[nestedKey];
            const isRequired = isParentRequired;

            const field = createField(`${key}.${nestedKey}`, nestedProp, isRequired);

            if (field) {
                section.body.push(field);
            }
        });
    }
    // Handle special cases like component types
    if (components.includes(key)) {
        section.body = [{
            isMandatory: isParentRequired,
            key: key,
            type: "component",
            component: capitalizeFirstLetter(key),
            withoutLabel: true,
            disable: false,
            customProps: {},
            populators: {
                name: key,
                required: property.required ? true : false,
                error: "Required"
            }
        }];
    }

    return section;
};

/**
 * Creates a section for an array type property
 * @param {String} key - Property key
 * @param {Object} property - Property schema
 * @param {Boolean} isRequired - Whether this field is required
 * @returns {Object} Section configuration
 */
const createArraySection = (key, property, isRequired) => {
    // Create specialized section for array types
    return {
        head: getHeadingFromKey(key),
        key: key,
        subHead: property.description || "",
        body: [{
            isMandatory: false,
            key: key,
            type: "component",
            component: capitalizeFirstLetter(key),
            withoutLabel: true,
            disable: false,
            customProps: {},
            populators: {
                name: key,
                required: isRequired,
                error: "Required"
            }
        }]
    };
};

/**
 * Creates a field configuration from a schema property
 * @param {String} key - Property key
 * @param {Object} property - Property schema
 * @param {Boolean} isRequired - Whether this field is required
 * @returns {Object|null} Field configuration or null if not applicable
 */
const createField = (key, property, isRequired) => {
    // Skip certain types or components handled elsewhere
    if (property.type === "object" || property.type === "array") {
        return null;
    }
    const field = {
        inline: true,
        label: getLabel(key),
        isMandatory: isRequired,
        key: key,
        type: getFieldType(property, key),
        populators: {
            name: key,
            error: getErrorMessage(key, property),
            validation: getValidationRules(property, isRequired)
        }
    };

    // Add description if available
    if (property.description) {
        field.description = property.description;
    }

    // Special handling for different field types
    if (property.enum) {
        handleEnumField(field, property);
    } else if (property.items && property.items.enum) {
        handleEnumField(field, { enum: property.items.enum });
    }

    // Special handling for checkbox types
    if (property.type === "boolean") {
        field.type = "checkbox";
        field.withoutLabel = true;
        field.populators.title = getLabel(key);
    }

    return field;
};

/**
 * Enhances a field with dropdown options for enum values
 * @param {Object} field - Field configuration object
 * @param {Object} property - Property schema
 */
const handleEnumField = (field, property) => {
    field.type = "dropdown";
    field.populators.options = property.enum.map(value => ({
        code: value,
        name: value
    }));
    field.populators.optionsKey = "name";
};

/**
 * Generates validation rules based on property schema
 * @param {Object} property - Property schema
 * @param {Boolean} isRequired - Whether this field is required
 * @returns {Object} Validation rules
 */
const getValidationRules = (property, isRequired) => {
    const validation = {};

    if (isRequired) {
        validation.required = true;
    }

    if (property.minLength !== undefined) {
        validation.minLength = property.minLength;
    }

    if (property.maxLength !== undefined) {
        validation.maxLength = property.maxLength;
    }

    if (property.pattern) {
        validation.pattern = new RegExp(property.pattern);
    }

    if (property.minimum !== undefined) {
        validation.min = property.minimum;
    }

    if (property.maximum !== undefined) {
        validation.max = property.maximum;
    }

    // Add specific validations based on property type
    if (property.type === "number" || property.type === "integer") {
        if (!property.pattern && property.description?.includes("10-digit")) {
            validation.pattern = /^[0-9]{10}$/;
        }
    }

    return Object.keys(validation).length > 0 ? validation : undefined;
};

/**
 * Gets the appropriate field type from schema property
 * @param {Object} property - Property schema
 * @param {String} key - Property key
 * @returns {String} Field type
 */
const getFieldType = (property, key) => {
    switch (property.type) {
        case "string":
            if (property.format === "date" || property.description?.toLowerCase().includes("date")) {
                return "date";
            } else if (property.description?.toLowerCase().includes("mobile") ||
                property.description?.toLowerCase().includes("phone")) {
                return "mobileNumber";
            } else if (
                (property.description?.toLowerCase().includes("address") || property.maxLength > 100) || key.toLowerCase().includes("address")
            ) {
                return "textarea";
            }

            return "text";
        case "number":
            if (property.description?.toLowerCase().includes("mobile") ||
                property.description?.toLowerCase().includes("phone")) {
                return "mobileNumber";
            }
            return "number";
        case "integer":
            return "number";
        case "boolean":
            return "checkbox";
        case "array":
            return "dropdown";
        default:
            return "text";
    }
};

/**
 * Generates an error message for a field
 * @param {String} key - Property key
 * @param {Object} property - Property schema
 * @returns {String} Error message
 */
const getErrorMessage = (key, property) => {
    if (property.errorMessage) {
        return property.errorMessage;
    }

    const label = getLabel(key);

    if (property.type === "number" && property.description?.includes("10-digit")) {
        return "10-digit number required";
    }

    return `${label} is required`;
};

/**
 * Generates a label from a property key
 * @param {String} key - Property key
 * @returns {String} Formatted label
 */
const getLabel = (key) => {
    // Handle nested keys (e.g., complaintLocation.pincode)
    const keyParts = key.split('.');
    const finalKey = keyParts[keyParts.length - 1];

    return finalKey
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
        .replace(/([-_])/g, ' ') // Replace hyphens and underscores with spaces
        .trim();
};

/**
 * Generates a heading from a property key
 * @param {String} key - Property key
 * @returns {String} Formatted heading
 */
const getHeadingFromKey = (key) => {
    const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([-_])/g, ' ')
        .trim();

    // Special cases for specific keys
    if (key === "config") {
        return "Config";
    } else if (key === "complaintLocation") {
        return "Complaint Location Details";
    } else if (key === "complaintType") {
        return "Complaint Type";
    } else if (key === "pictureUpload") {
        return "Picture Upload";
    }

    return formattedKey;
};

/**
 * Capitalizes the first letter of a string
 * @param {String} string - Input string
 * @returns {String} String with first letter capitalized
 */
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};