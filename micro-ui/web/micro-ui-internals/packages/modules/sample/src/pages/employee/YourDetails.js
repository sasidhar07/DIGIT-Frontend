import React from "react";
import { FormComposerV2 } from "@egovernments/digit-ui-components";
import { config } from "../../configs/SampleCreateYourFormConfig";

const YourDetails = () => {
    const onSubmit = (data) => {
        console.log(data, "data");
    };
    const defaultValues = {
        "user type": "CITIZEN"
    }
    return (
        <FormComposerV2
            heading={"Your_Application_Form"}
            label={"Submit"}
            description={"Description"}
            config={config}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            fieldStyle={{ marginRight: 0 }}
        />

    );
};

export default YourDetails;
