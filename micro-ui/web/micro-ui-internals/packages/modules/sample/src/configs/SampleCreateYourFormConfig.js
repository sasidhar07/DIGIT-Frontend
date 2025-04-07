import { Loader, FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const config = [
    {

        body: [
            {
                inline: false,
                label: "First Name",
                isMandatory: true,
                type: "text",
                disable: false,
                populators: { name: "first name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i, minlength: 3 } },
            },
            {
                inline: true,
                label: "Last Name",
                isMandatory: true,
                type: "text",
                disable: false,
                populators: { name: "last name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i }, minlength: 3 },
            },
            {
                isMandatory: true,
                type: "dropdown",
                key: "genders",
                label: "Gender",
                disable: false,
                populators: {
                    name: "gender",
                    optionsKey: "name",
                    error: "Gender is required message",
                    required: true,
                    options: [
                        {
                            code: "male",
                            name: "Male"
                        },
                        {
                            code: "female",
                            name: "female"
                        }, {
                            code: "other",
                            name: "Other"
                        }
                    ],


                    // mdmsConfig: {
                    //     masterName: "GenderType",
                    //     moduleName: "common-masters",
                    //     localePrefix: "COMMON_GENDER",
                    // },
                },
            },
            {
                label: "Age",
                isMandatory: true,
                type: "number",
                disable: false,
                populators: { name: "age", error: "Age is Required", validation: { min: 0, max: 100 } },
            },
            {
                inline: true,
                label: "DOB",
                description: "Please enter a valid Date of birth",
                type: "date",
                disable: false,
                populators: { name: "dob", error: "Required", validation: { required: true, } },
            },
            {
                inline: true,
                label: "User Type",
                isMandatory: true,
                description: "Please enter a User Type",
                type: "text",
                disable: false,
                populators: { name: "user type", error: "Required" },
            },
            {
                label: "Phone number",
                isMandatory: true,
                type: "mobileNumber",
                disable: false,
                populators: { name: "Phone Number", error: "Phone Number is Required", validation: { min: 5999999999, max: 9999999999 } },
            },
            {
                inline: true,
                label: "Address",
                isMandatory: true,
                description: "address details",
                type: "textarea",
                disable: false,
                populators: { name: "address", error: "Address is Required", validation: { pattern: /^[A-Za-z\s,]+$/i } },
            },
            {
                inline: true,
                label: "Occupation",
                isMandatory: true,
                type: "radio",
                disable: false,
                populators: {
                    name: "occupation",
                    optionsKey: "name",
                    options: [
                        {
                            code: "student",
                            name: "Student"
                        },
                        {
                            code: "employed",
                            name: "Employed"
                        },
                        {
                            code: "self employed",
                            name: "Self Employed"
                        }
                    ],
                    error: "Occupation is Required"
                },
            },

        ],
    }
]