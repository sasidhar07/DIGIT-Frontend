import { Loader, FormComposerV2 } from "@egovernments/digit-ui-react-components";


export const config = [
  {
    head: "Config",
    subHead: "Configuration options.",
    body: [

      {
        inline: true,
        withoutLabel: true,
        type: "checkbox",
        description: "Configuration options.",
        populators: {
          name: "isStepper",
          title: "isStepper",
        }
      },
      {
        inline: true,
        withoutLabel: true,
        type: "checkbox",
        description: "Configuration options.",
        populators: {
          name: "isAddress",
          title: "isAddress",
        }
      },
    ]
  },
  {
    head: "Citizen Details",
    subHead: "Please provide basic Citizen information",
    body: [
      {
        inline: true,
        label: "Citizen Name",
        isMandatory: true,
        type: "text",
        description: "Citizen name must be between 5-100 characters",
        populators: {
          name: "citizenName",
          validation: {
            required: true,
            minLength: 5,
            maxLength: 100,
            pattern: /^[A-Za-z\s]+$/
          }
        }
      },
      {
        inline: true,
        label: "Mobile Number",
        isMandatory: true,
        type: "mobileNumber",
        description: "Citizen mobile number must be a 10-digit number.",
        populators: {
          name: "citizenMobileNumber",
          error: "10-digit number required",
          validation: {
            required: true,
            pattern: /^[0-9]{10}$/
          }
        }
      },
      // {
      //   label: "Complaint Type",
      //   // isMandatory: true,
      //   type: "dropdown",
      //   populators: {
      //     name: "complaintType",
      //     error: "Please select at least one complaint type",
      //     // validation: {
      //     //   required: true
      //     // },
      //     allowMultiSelect: true,
      //     mdmsConfig: {
      //       masterName: "ComplaintType",
      //       moduleName: "PGR",
      //       localePrefix: "PGR_COMPLAINT_TYPE"
      //     }
      //   }
      // },
      // {
      //   type: "component",
      //   component: "DocumentUpload",
      //   withoutLabel: true,
      //   populators: {
      //     name: "pictureUpload",
      //     type: "documentUpload",
      //     error: "Please upload supporting documents"
      //   }
      // }
    ]
  },
  {
    // Section for additional information
    head: "Complaint Type",
    key: "complaintType",
    body: [
      {
        isMandatory: false,
        key: "complaintType",
        type: "component", // Custom component rendering
        component: "AdditionalComplaint",
        withoutLabel: true,
        disable: false,
        customProps: {},
        populators: { name: "complaintType", required: true },
      },
    ],
  },
  {
    head: "Picture Upload",
    subHead: "Picture upload field, type must be 'documentUpload'.",
    body: [
      {
        inline: true,
        label: "type",
        isMandatory: true,
        type: "dropdown",
        description: "Citizen name must be between 5-100 characters",
        populators: {
          required: true,
          name: "type",
          optionsKey: "name",
          error: "Gender is required message",
          required: true,
          options: [
            {
              code: "documentUpload",
              name: "documentUpload"
            },
          ]

        }
      },

    ]
  },
  {
    head: "Complaint Location Details",
    subHead: "Where is the complaint located?",
    body: [
      {
        inline: true,
        label: "Pincode",
        isMandatory: true,
        type: "number",
        populators: {
          name: "complaintLocation.pincode",
          error: "Valid pincode required",
          validation: {
            required: true,
            pattern: /^[1-9][0-9]{5}$/
          }
        }
      },
      {
        inline: true,
        label: "City",
        isMandatory: true,
        type: "text",
        populators: {
          name: "complaintLocation.city",
          error: "City name required",
          validation: {
            required: true,
            pattern: /^[A-Za-z\s]+$/
          }
        }
      },
      {
        inline: true,
        label: "Landmark",
        isMandatory: true,
        type: "text",
        populators: {
          name: "complaintLocation.landmark",
          error: "Landmark required",
          validation: {
            required: true
          }
        }
      },
      {
        label: "Full Address",
        isMandatory: true,
        type: "textarea",
        populators: {
          name: "complaintLocation.address",
          error: "Complete address required",
          validation: {
            required: true,
            minLength: 10,
            maxLength: 200
          }
        }
      }
    ]
  }
];
