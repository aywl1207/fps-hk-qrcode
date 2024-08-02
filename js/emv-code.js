function dataObj(id, value) {
    var paddedLength = String(value.length).pad(2);
    return String(id + paddedLength + value);
}

function emvEncode(obj) {
    var payloadFormatIndicator = dataObj("00", "01");
    var pointOfInitiationMethod = dataObj("01", (obj.amount == "") ? "11" : "12");

    var guid = dataObj("00", "hk.com.hkicl");
    var merchantAccountInformationTemplate = "";
    var reference = "";

    switch (obj.account) {
        case "02":
            merchantAccountInformationTemplate = dataObj("02", obj.fps_id);
            reference = (obj.reference == "") ? "" : dataObj("05", obj.reference);
            break;
        case "03":
            merchantAccountInformationTemplate = (obj.bank_code == "") ? dataObj("03", obj.mobile) : dataObj("01", obj.bank_code) + dataObj("03", obj.mobile);
            reference = (obj.reference == "") ? "" : dataObj("09", obj.reference);
            break;
        case "04":
            merchantAccountInformationTemplate = (obj.bank_code == "") ? dataObj("04", obj.email.toUpperCase()) : dataObj("01", obj.bank_code) + dataObj("04", obj.email.toUpperCase());
            reference = (obj.reference == "") ? "" : dataObj("09", obj.reference);
            break;
    }

    var merchantAccountInformation = dataObj("26", guid + merchantAccountInformationTemplate);
    var merchantCategoryCode = dataObj("52", obj.mcc);
    var transactionCurrency = dataObj("53", obj.currency);
    var countryCode = dataObj("58", "HK");
    var merchantName = dataObj("59", "NA");
    var merchantCity = dataObj("60", "HK");
    var transactionAmount = (obj.amount == "") ? "" : dataObj("54", obj.amount);
    var additionalDataTemplate = (reference == "") ? "" : dataObj("62", reference);

    var msg = ""
    msg += payloadFormatIndicator;
    msg += pointOfInitiationMethod;
    msg += merchantAccountInformation;
    msg += merchantCategoryCode;
    msg += transactionCurrency;
    msg += countryCode;
    msg += merchantName;
    msg += merchantCity;
    msg += transactionAmount;
    msg += additionalDataTemplate;
    msg += "6304";

    return msg;
}
