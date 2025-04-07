import React from "react";
import { FormComposerV2, showToast } from "@egovernments/digit-ui-components";
import { config } from "../../configs/assignmentConfig";
import { transformComplaintData } from "../../utils/ComplaintUtil";
import schema from "../../schema/shema.json";
import { schemaToConfig } from "../../utils/GenerateConfig";
const Assignment = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    console.log("weuyg7")
    const confi = schemaToConfig(schema)
    const configs = confi.filter((each) => each.key != "config")
    console.log(configs)

    const reqCreate = {
        url: `/egov-mdms-service/v2/_create/Assignment.PGRAPPLY`, // API endpoint for creating an individual
        params: {},
        body: {},
        config: {
            enable: true, // Enables the API call
        },
    };
    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

    const onSubmit = async (data) => {
        console.log(data, "data");
        console.log(transformComplaintData(data))
        await mutation.mutate(
            {
                url: `/egov-mdms-service/v2/_create/Assignment.PGRAPPLY`,
                params: { tenantId }, // Include tenant ID in API request
                body: transformComplaintData(data), // Transform data before sending to API
                config: {
                    enable: true,
                    // headers: headers
                },
            },
            {
                // Handle success response
                onSuccess: (data) => {
                    setShowToast({ key: "success", label: "Individual Created Successfully" });
                },
                // Handle error response
                onError: (error) => {
                    setShowToast({ key: "error", label: "Individual Creation Failed" });
                },
            }
        );
    };
    const defaultValues = {
        "isStepper": false,
        "isAddress": false
    }
    return (
        <div>
            <FormComposerV2
                label={"Submit"}
                config={configs}
                defaultValues={defaultValues}
                onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
                    console.log(formData, "formData"); // Debug log when form values change
                }}
                onSubmit={onSubmit}
                fieldStyle={{ marginRight: 0 }}
            />
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    error={showToast.key === "error"}
                    onClose={() => setShowToast(null)}
                />
            )}
        </div>

    );
};

export default Assignment;
