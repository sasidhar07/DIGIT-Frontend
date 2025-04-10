import {
    Button,
    Dropdown,
    LabelFieldPair,
    TextInput,
    CustomSVG,
    Card,
    HeaderComponent,
} from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ComplaintTypeComponent = ({ onSelect }) => {
    const { t } = useTranslation();

    const complaintTypeOptions = {
        "Street Light Not Working": "STREET_LIGHT_NOT_WORKING",
        "Garbage Not Collected": "GARBAGE_NOT_COLLECTED",
        "Water Leakage": "WATER_LEAKAGE",
        "Road Damage": "ROAD_DAMAGE",
        "Sewage Overflow": "SEWAGE_OVERFLOW",
        "Illegal Construction": "ILLEGAL_CONSTRUCTION",
        "Noise Pollution": "NOISE_POLLUTION",
        "Tree Fallen": "TREE_FALLEN",
        "Animal Nuisance": "ANIMAL_NUISANCE",
        "Drain Blockage": "DRAIN_BLOCKAGE",
    };

    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [complaintEntries, setComplaintEntries] = useState([
        {
            key: 1,
            type: null,
            value: null,
        }
    ]);

    // Transform complaint options for dropdown format
    useEffect(() => {
        const formattedOptions = Object.entries(complaintTypeOptions).map(([name, code]) => ({
            name,
            code,
        }));
        setDropdownOptions(formattedOptions);
    }, []);

    // Update parent component when entries change
    useEffect(() => {
        onSelect("complaintType", complaintEntries);
    }, [complaintEntries, onSelect]);

    const handleFieldUpdate = ({ type, value, item }) => {
        setComplaintEntries((prevEntries) =>
            prevEntries.map((entry) => {
                if (entry.key === item.key) {
                    if (type === "TYPE") {
                        return {
                            ...entry,
                            type: value?.name,
                            value: value?.code || null
                        };
                    } else {
                        return {
                            ...entry,
                            value: value
                        };
                    }
                }
                return entry;
            })
        );
    };

    const addComplaintEntry = () => {
        setComplaintEntries((prevEntries) => [
            ...prevEntries,
            {
                key: prevEntries.length + 1,
                value: null,
                type: null,
            },
        ]);
    };

    const deleteComplaintEntry = (entryToDelete) => {
        const filteredEntries = complaintEntries.filter((entry) => entry.key !== entryToDelete.key);
        const reindexedEntries = filteredEntries.map((entry, index) => ({
            ...entry,
            key: index + 1
        }));
        setComplaintEntries(reindexedEntries);
    };

    return (
        <Fragment>
            {complaintEntries.map((entry) => (
                <Card key={entry.key} type="secondary" style={{ marginBottom: "1.5rem", gap: "1.5rem" }}>
                    {complaintEntries.length > 1 && (
                        <div style={{ textAlign: "right" }} onClick={() => deleteComplaintEntry(entry)}>
                            <CustomSVG.DustbinIcon />
                        </div>
                    )}
                    <LabelFieldPair removeMargin={true}>
                        <HeaderComponent>
                            <div>
                                <label>{t("Name")}</label>
                            </div>
                        </HeaderComponent>
                        <Dropdown
                            style={{ width: "100%" }}
                            t={t}
                            option={dropdownOptions}
                            optionKey="name"
                            selected={dropdownOptions.find((option) => option.code === entry.type)}
                            select={(value) => handleFieldUpdate({ type: "TYPE", value, item: entry })}
                        />
                    </LabelFieldPair>
                    <LabelFieldPair removeMargin={true}>
                        <HeaderComponent>
                            <div>
                                <label>{t("Code")}</label>
                            </div>
                        </HeaderComponent>
                        <TextInput
                            style={{ width: "100%" }}

                            name="complaintCode"
                            value={entry.value || ""}
                            onChange={(event) =>
                                handleFieldUpdate({
                                    type: "VALUE",
                                    value: event.target.value,
                                    item: entry
                                })
                            }
                            disabled={true}
                        />
                    </LabelFieldPair>
                </Card>
            ))}
            <Button
                variation="secondary"
                label={t("Add more")}
                icon="AddIconNew"
                onClick={addComplaintEntry}
                style={{ marginLeft: "auto" }}
            />
        </Fragment>
    );
};

export default ComplaintTypeComponent;