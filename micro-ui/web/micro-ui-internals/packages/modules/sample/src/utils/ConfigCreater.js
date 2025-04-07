// import { getMdmsConfig } from "./mdmsUtils"; // Assume this fetches MDMS config

// export const schemaToFormConfig = (schema) => {
//     if (!schema || !schema.properties) return [];

//     const requiredFields = schema.required || [];
//     const config = [];

//     // Process root-level properties
//     for (const [propName, propSchema] of Object.entries(schema.properties)) {
//         const isRequired = requiredFields.includes(propName);

//         // Handle object types as sections
//         if (propSchema.type === "object") {
//             const section = createObjectSection(propName, propSchema, isRequired);
//             config.push(section);
//         }
//         // Handle special non-object fields (e.g., citizenName, citizenMobileNumber)
//         else {
//             const sectionKey = getSectionKey(propName);
//             let section = config.find((s) => s.key === sectionKey);

//             if (!section) {
//                 section = createDefaultSection(sectionKey);
//                 config.push(section);
//             }

//             const field = createFormField(propName, propSchema, isRequired);
//             section.body.push(field);
//         }
//     }

//     return config;
// };

// // Helper: Create section for object-type properties
// const createObjectSection = (propName, propSchema, isParentRequired) => {
//     const requiredSubFields = propSchema.required || [];
//     const body = [];

//     for (const [subPropName, subPropSchema] of Object.entries(propSchema.properties)) {
//         const isRequired = requiredSubFields.includes(subPropName) || isParentRequired;
//         const field = createFormField(subPropName, subPropSchema, isRequired, propName);
//         body.push(field);
//     }

//     return {
//         head: propName.replace(/([A-Z])/g, " $1").trim().toUpperCase(),
//         subHead: propSchema.description || "",
//         key: propName,
//         body,
//     };
// };

// // Helper: Create form field configuration
// const createFormField = (name, schema, isRequired, parentName) => {
//     const fieldName = parentName ? `${parentName}.${name}` : name;
//     const type = getFieldType(schema);

//     const field = {
//         inline: true,
//         label: name.replace(/([A-Z])/g, " $1").trim().toUpperCase(),
//         isMandatory: isRequired,
//         type,
//         description: schema.description || "",
//         populators: {
//             name: fieldName,
//             validation: getValidationRules(schema),
//         },
//     };

//     // Special handling for component types
//     if (type === "component") {
//         field.withoutLabel = true;
//         field.component = schema["x-component"];
//     }

//     // Handle dropdowns with MDMS
//     if (type === "dropdown" && schema["x-mdms"]) {
//         field.populators.mdmsConfig = getMdmsConfig(schema["x-mdms"]);
//     }

//     return field;
// };

// // Helper: Map schema type to UI component
// const getFieldType = (schema) => {
//     if (schema["x-component"]) return "component";

//     switch (schema.type) {
//         case "string":
//             if (schema.pattern === "^\\d{10}$") return "mobileNumber";
//             return "text";
//         case "number":
//             return "number";
//         case "boolean":
//             return "checkbox";
//         case "array":
//             return "dropdown";
//         default:
//             return "text";
//     }
// };

// // Helper: Generate validation rules
// const getValidationRules = (schema) => {
//     const rules = {};
//     if (schema.minLength) rules.minLength = schema.minLength;
//     if (schema.maxLength) rules.maxLength = schema.maxLength;
//     if (schema.pattern) rules.pattern = new RegExp(schema.pattern);
//     return rules;
// };

// // Helper: Determine section grouping
// const getSectionKey = (propName) => {
//     if (propName.startsWith("citizen")) return "citizenDetails";
//     if (propName.startsWith("complaintType")) return "complaintType";
//     return "default";
// };

// // Helper: Create default sections (e.g., Citizen Details)
// const createDefaultSection = (key) => {
//     const sections = {
//         citizenDetails: {
//             head: "Citizen Details",
//             subHead: "Please provide basic Citizen information",
//             key: "citizenDetails",
//             body: [],
//         },
//         complaintType: {
//             head: "Complaint Type",
//             key: "complaintType",
//             body: [],
//         },
//         default: {
//             head: "Additional Information",
//             key: "default",
//             body: [],
//         },
//     };
//     return { ...sections[key] };
// };



export function generateConfigFromSchema(schema) {
    const config = [];
  
    // Helper to generate a field config
    const getFieldConfig = (key, propertySchema) => {
      const field = {
        inline: true,
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        isMandatory: schema.required?.includes(key) || false,
        type: "text", // default type
        populators: {
          name: key,
          error: propertySchema.description || "Invalid input",
          validation: {},
        },
      };
  
      const type = propertySchema.type;
  
      // Determine field type
      if (type === "boolean") {
        field.type = "checkbox";
        field.withoutLabel = true;
        field.description = propertySchema.description;
        field.populators.title = key;
      } else if (type === "number" || type === "integer") {
        field.type = "number";
      } else if (type === "string" && key.toLowerCase().includes("mobile")) {
        field.type = "mobileNumber";
      } else if (type === "string" && propertySchema.enum?.includes("documentUpload")) {
        field.type = "dropdown";
        field.populators.options = propertySchema.enum.map((v) => ({ code: v, name: v }));
      } else if (type === "array") {
        field.type = "dropdown";
        field.populators.allowMultiSelect = true;
      } else if (type === "object" && propertySchema.properties) {
        // Skip object properties directly — handled as nested groups
        return null;
      }
  
      // Set validation if applicable
      if (propertySchema.pattern) field.populators.validation.pattern = propertySchema.pattern;
      if (propertySchema.minLength) field.populators.validation.minLength = propertySchema.minLength;
      if (propertySchema.maxLength) field.populators.validation.maxLength = propertySchema.maxLength;
  
      return field;
    };
  
    // Recursively build config sections
    const buildSection = (properties, sectionKey = "") => {
      const section = {
        head: sectionKey ? sectionKey.replace(/^./, (str) => str.toUpperCase()) : "Form",
        body: [],
      };
  
      for (const [key, prop] of Object.entries(properties)) {
        if (prop.type === "object" && prop.properties) {
          // Nested object - make a separate section
          config.push(buildSection(prop.properties, key));
        } else {
          const field = getFieldConfig(key, prop);
          if (field) section.body.push(field);
        }
      }
  
      return section;
    };
  
    // Build main config
    config.push(buildSection(schema.properties));
  
    return config;
  }
  