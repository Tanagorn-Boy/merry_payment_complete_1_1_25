// ฟังก์ชันตรวจสอบว่า name เป็นภาษาอังกฤษและตัวแรกเป็นพิมพ์ใหญ่
export const validateName = (name) => {
  const regex = /^[A-Za-z]+$/;
  if (!name) {
    return "The name cannot be empty.";
  }
  if (!regex.test(name)) {
    return "The name should contain only English letters.";
  }
  if (name[0] !== name[0].toUpperCase()) {
    return "The first letter of the name should be uppercase.";
  }
  return null; // หากไม่มีข้อผิดพลาด
};

// ฟังก์ชันตรวจสอบว่า email อยู่ในรูปแบบที่ถูกต้อง
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Please enter your email.";
  }
  if (!regex.test(email)) {
    return "Please enter a valid email address.";
  }
  return null; // หากไม่มีข้อผิดพลาด
};

// ฟังก์ชันตรวจสอบข้อมูลที่จำเป็นว่าถูกกรอกครบถ้วน
export const validateRequiredFieldsStep1 = (fields) => {
  const requiredFieldsStep1 = [
    "name",
    "date",
    "selectedLocation",
    "citys",
    "username",
    "email",
  ];

  for (let field of requiredFieldsStep1) {
    if (!fields[field] || fields[field].trim() === "") {
      return `Please fill in all required fields in`;
    }
  }
  return null; // หากกรอกครบ
};

// ฟังก์ชันตรวจสอบข้อมูลที่จำเป็นใน Step 2
export const validateRequiredFieldsStep2 = (fields) => {
  const requiredFieldsStep2 = [
    "sexualIdentities",
    "sexualPreferences",
    "racialIdentities",
    "racialPreferences",
    "meetingInterests",
    "hobbies",
    "aboutme",
  ];

  for (let field of requiredFieldsStep2) {
    if (
      !fields[field] ||
      (typeof fields[field] === "string" && fields[field].trim() === "")
    ) {
      return `Please fill in all required fields in`;
    }
  }
  return null; // หากกรอกครบ
};
