export const formatCurrency = (amount, currency = "CAD", locale = "en-CA") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};