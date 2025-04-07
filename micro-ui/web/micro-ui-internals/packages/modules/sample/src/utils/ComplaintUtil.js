export const transformComplaintData = (data) => {
    return {
        Mdms: {
            tenantId: "dev",
            schemaCode: "Assignment.PGRAPPLY",
            uniqueIdentifier: null,
            data: {
                config: {
                    isAddress: true,
                    isStepper: true
                },
                complaintType: data?.complaintType?.map((item) => ({
                    code: item?.code || "",
                    name: item?.name || ""
                })) || [],
                complaintLocation: {
                    city: data?.complaintLocation?.city || "",
                    address: data?.complaintLocation?.address || "",
                    pincode: parseInt(data?.complaintLocation?.pincode, 10) || 0,
                    landmark: data?.complaintLocation?.landmark || ""
                },
                citizenName: data?.citizenName || "",
                pictureUpload: {
                    type: data?.pictureUpload?.type?.code || ""
                },
                citizenMobileNumber: parseInt(data?.citizenMobileNumber, 10) || 0
            },
            isActive: true
        }
    };
};
