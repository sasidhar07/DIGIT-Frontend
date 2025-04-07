import { Button, Dropdown, LabelFieldPair, TextInput, CustomSVG, Card, HeaderComponent } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdditionalComplaint = ({ onSelect, ...props }) => {
    const { t } = useTranslation();
   
    const [documentData, setDocumentData] = useState([
        {
            key: 1,
            code: "",
            name: "",
        },
    ]);

    // fn to update the code or name fields independently
    const handleUpdateField = ({ fieldType, value, item }) => {
        setDocumentData((prev) => {
            return prev.map((i) => {
                if (i.key === item.key) {
                    return {
                        ...i,
                        [fieldType]: value,
                    };
                }
                return i;
            });
        });
    };

    //fn to add more field
    const add = () => {
        setDocumentData((prev) => [
            ...prev,
            {
                key: prev?.length + 1,
                code: "",
                name: "",
            },
        ]);
    };

    const deleteItem = (data) => {
        const fil = documentData.filter((i) => i.key !== data.key);
        const up = fil.map((item, index) => ({ ...item, key: index + 1 }));
        setDocumentData(up);
    };

    useEffect(() => {
        onSelect("complaintType", documentData);
    }, [documentData]);

    return (
        <>
            {documentData?.map((item, index) => (
                <Card key={item.key} type="secondary" style={{ marginBottom: "1.5rem", gap: "1.5rem" }}>
                    {documentData?.length > 1 ? (
                        <div className="delete-resource-icon" style={{ textAlign: "right" }} onClick={() => deleteItem(item, index)}>
                            <CustomSVG.DustbinIcon />
                        </div>
                    ) : null}
                    <LabelFieldPair removeMargin={true}>
                        <HeaderComponent >
                            <div >
                                <label >{`${t("CODE")}`}</label>
                            </div>
                        </HeaderComponent>
                        <TextInput
                            name="code"
                            value={item.code}
                            onChange={(event) => handleUpdateField({ fieldType: "code", value: event.target.value, item: item })}
                        />
                    </LabelFieldPair>
                    <LabelFieldPair removeMargin={true}>
                        <HeaderComponent>
                            <div >
                                <label >{`${t("Name")}`}</label>
                            </div>
                        </HeaderComponent>
                            <TextInput
                                name="name"
                                value={item.name}
                                onChange={(event) => handleUpdateField({ fieldType: "name", value: event.target.value, item: item })}
                            />
                    </LabelFieldPair>
                </Card>
            ))}
            <Button variation="secondary" label={t(`Add more`)} className={""} icon={"AddIconNew"} onClick={add} style={{ marginLeft: "auto" }} />
        </>
    );
};

export default AdditionalComplaint;