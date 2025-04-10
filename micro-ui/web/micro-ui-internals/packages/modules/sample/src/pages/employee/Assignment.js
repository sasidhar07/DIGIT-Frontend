import React, { useState } from "react";
import { FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import { transformComplaintData } from "../../utils/ComplaintUtil";
import schema from "../../schema/shema.json";
import { schemaToConfig } from "../../utils/GenerateConfig";

const Assignment = () => {

    const [toastData, setToastData] = useState(null);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const components = ["complaintType", "additionalDetails", "sampleDetails"]

    let configs = schemaToConfig(schema, components);
    configs = configs.filter((each) => each.key !== "config");

    const reqCreate = {
        url: `/egov-mdms-service/v2/_create/Assignment.PGRAPPLY`,
        params: {},
        body: {},
    };

    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

    const onSubmit = async (data) => {
        data.tenantId = tenantId
        await mutation.mutate(
            {
                url: reqCreate.url,
                params: { tenantId },
                body: transformComplaintData(data),
            },
            {
                onSuccess: () => {
                    setToastData({ key: "success", label: "Individual Created Successfully" });
                },
                onError: () => {
                    setToastData({ key: "error", label: "Individual Creation Failed" });
                },
            }
        );
    };

    return (
        <div>
            <FormComposerV2
                label={"Submit"}
                config={configs}
                defaultValues={{}}
                onSubmit={onSubmit}
            />
            {toastData && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={toastData.label}
                    type={toastData.key}
                    error={toastData.key === "error"}
                    onClose={() => setToastData(null)}
                />
            )}
        </div>
    );
};

export default Assignment;
