import * as yup from "yup";
export const orderSubmissionValidation = yup.object().shape({
  // number: yup.number().required("Number is required"),
  // name: yup.string().required("Name is required"),
  // password: yup.string().min(6).max(32).required(),
  // email: yup.string().email().required("Email is required"),
  // presentAddress: yup.string().required("Present Address is required"),
  // permanentAddress: yup.string().required("Permanent Address is required"),
  // address: yup.string().required("Secondary Address is required"),
  // contactNo: yup.string()
  //     .test('len', 'Contact number must be exactly 11 digits', val => val && val.toString().length === 11)
  //     .required("Contact number is required"),
  // bioData: yup.string().required().max(250, "Bio data should not exceed 250 characters"),
  // about: yup.string().required().max(250, "About should not exceed 250 characters"),
  // file: yup.mixed().required('A file is required')
});
export const mainCategorySchemaValidation = yup.object().shape({
  name_en: yup.string().required("Name is required"),
  name_bn: yup.string().required("Name is required"),
  image: yup.mixed().required("Image is required"),
});
export const brandSchemaValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Name is required"),
});
export const officeSchemaValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  location: yup.string().required("Location is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
});
export const vendorValidationSchema = yup.object().shape({
  organization_name: yup.string().required(),
  organization_address: yup.string().required(),
  bin_number: yup.string().required(),
  tin_number: yup.string().required(),
  bank_name: yup.string().required(),
  branch_name: yup.string().required(),
  account_name: yup.string().required(),
  bank_account_number: yup.string().required(),
  routing_number: yup.string().required(),
  mobile_banking_type: yup.string().required(),
  mobile_banking_number: yup.string().required(),
  name: yup.string().required(),
  permanent_address: yup.string().required(),
  present_address: yup.string().required(),
  phone_number: yup.string().required(),
  additional_number: yup.string().required(),
  email: yup.string().required(),
});

export const productvalidationSchema = yup.object().shape({
  main_categories_id: yup.object().required("Product Status is required"),
  active_status: yup.object().required("Product Status is required"),
  product_code: yup.string().required("Product code is required"),
  product_title_en: yup.string().required("Product title is required"),
  product_title_bn: yup.string().required("Product title is required"),
  product_slug: yup.string().required("Product slug is required"),
  pack_size: yup.string().required("Pack size is required"),
  vendor: yup.object().required("Vendor is required"),
  brand: yup.object().required("Brand is required"),
  sales_masuring_unit: yup.object().required("Sales Mesuring Unit is required"),
  regular_prices: yup.number().required("Regular  price is required"),
  vat: yup.number().default(0),
  mrp: yup.number().default(0),
  product_weight: yup.number().required("Weight  is required"),
  product_weight_type: yup
    .string()
    .required("Product weight type  is required"),
  product_image: yup.mixed().required("A file is required"),
  product_gallery: yup.mixed().required("A file is required"),
  discount_amount: yup.number().default(0),
});
export const productUpdatevalidationSchema = yup.object().shape({
  active_status: yup.object().required("Product Status is required"),
  product_code: yup.string().required("Product code is required"),
  product_title_en: yup.string().required("Product title is required"),
  product_title_bn: yup.string().required("Product title is required"),
  product_slug: yup.string().required("Product slug is required"),
  sales_masuring_unit: yup.object().required("Sales Mesuring Unit is required"),
  regular_prices: yup.number().required("Regular  price is required"),
  vat: yup.number().default(0),
  mrp: yup.number().default(0),
  product_image: yup.mixed().required("A file is required"),
  // product_gallery: yup.mixed().required("A file is required"),
  product_dec_en: yup.string().required("A file is required"),
  product_dec_bn: yup.string().required("A file is required"),
  discount_amount: yup.number().default(0),
  product_weight: yup.number().required("Field is required"),
  product_weight_type: yup.string().required("Field is required"),
  pack_size: yup.string().required("Pack size is required"),
});
export const loginSchema = yup.object().shape({
  userId: yup
    .string()
    .required("UserId is required")
    .min(5, "UserId must be at least 5 characters long"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "UserId must be at least 5 characters long"),
});

export const userCreateSchema = yup.object().shape({
  employee: yup.object().shape({
    employeeId: yup.string().required("Employee Id is required"),
    name: yup.string().required("Employee Name is required"),
    firstName: yup.string().required("FirstName Name is required"),
    lastName: yup.string().required("Last Name is required")
  }).required('employee required'),
  department: yup.object().required("Department is required"),
});
export const createSubscriberSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name should contain only letters'),
  phoneNumber: yup.string().required('Phone number is required')
  .matches(/^[0-9]+$/, 'Phone number must contain only digits')
  .test('len', 'Number must be exactly 11 digits', val => val ? val.length === 11 : false)
  ,
  division: yup.object().required('Division is required'),
  district: yup.object().required('District is required'),
  thana: yup.object().required('Thana is required'),
  profession: yup.object().required('Profession is required'),
  maritalStetus: yup.object().required('Marital Status is required'),
  familyMember: yup.object().required('Family Member is required'),
  buildingAddress: yup.string().required('Building Address is required'),
  shopingCalendar: yup.string().required('Shoping Calendar Is Required'),
  email: yup.string()
    .email('Must be a valid email address')
    .notRequired(),
});

export const subscriberOrderSubmittionSchema = yup.object().shape({
  orderNumber: yup.string().required('Order Number  is required'),
  orderDate: yup.string().required('Order date  is required'),
});



export const createCustomerSchema = yup.object().shape({
  customerName: yup.string().required(),
  customerPhoneNumber: yup.string().required('Phone number is required'),
  customerType: yup
    .object()
    .shape({
      label: yup.string().required('Customer type label is required'),
      value: yup.string().required('Customer type value is required'),
    })
    .test('customerType-required', 'Customer type is required', (value) => !!value && !!value.label && !!value.value),
  address: yup.string().required(),
  division: yup.object().when('customerType', (customerType:any, schema) => {
    console.log(customerType,"check");
    if (customerType[0].value === 'NON_PROBASHI') {
      return schema.required('Division is required for NON_PROBASHI customer type');
    }
    return schema;
  }),
  district: yup.object().when('customerType', (customerType:any, schema) => {
    console.log(customerType,"check");
    if (customerType[0].value === 'NON_PROBASHI') {
      return schema.required('Division is required for NON_PROBASHI customer type');
    }
    return schema;
  }),
  thana: yup.object().when('customerType', (customerType:any, schema) => {
    console.log(customerType,"check");
    if (customerType[0].value === 'NON_PROBASHI') {
      return schema.required('Division is required for NON_PROBASHI customer type');
    }
    return schema;
  }),
  country: yup.object().when('customerType', (customerType:any, schema) => {
    console.log(schema,"check schema");
    if (customerType[0].value === 'PROBASHI') {
      return schema.required('Division is required for NON_PROBASHI customer type');
    }
    return schema;
  }),
});
export const createWarehouseSchema = yup.object().shape({
  name: yup.string().required(),
  contactPerson: yup.string().required(),
  phone: yup.string().required('Phone number is required'),
  location: yup.string().required('Phone number is required')
});
export const createUserSchema = yup.object().shape({
  name: yup.string().required(),
  userId: yup.string().required(),
  email: yup.string().required(),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Phone number is required'),
  password: yup.string().required('Phone number is required'),
  role: yup.object().required('Phone number is required'),
});
