const encodeFormData = (data) => {
  console.log("encodeFormData" + "is called");
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

module.exports = encodeFormData;
