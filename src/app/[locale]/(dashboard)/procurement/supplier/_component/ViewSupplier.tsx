import React from "react";

type SupplierDetailsProps = {
  supplier: Record<string, any>;
  onClose: () => void;
};

const ViewSupplierInvoice: React.FC<SupplierDetailsProps> = ({
  supplier,
  onClose,
}) => {
  const formatValue = (key: string, value: any) => {
    if (!value && value !== 0)
      return <span className="text-gray-400 italic">Not specified</span>;

    if (key === "isActive")
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              value ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {value ? "Active" : "Inactive"}
        </span>
      );

    if (key === "rating") {
      const stars = Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < value ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
      return (
        <div className="flex items-center">
          <div className="flex">{stars}</div>
          <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
        </div>
      );
    }

    if (key === "website")
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          {value}
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      );

    if (key === "createdAt" || key === "updatedAt")
      return (
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(value).toLocaleString()}
        </div>
      );

    return value;
  };

  return (
    <div className="bg-white  shadow-xl  overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="bg-gradient-to-r from-primary to-green-950 px-6 py-5 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Supplier Information
          </h1>
          <p className="text-xs text-blue-100 mt-1 flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Ref: {supplier.id || "N/A"}
          </p>
        </div>
        <div className="text-right text-xs text-blue-100 space-y-1">
          <p className="flex items-center justify-end">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Created: {formatValue("createdAt", supplier.createdAt)}
          </p>
          <p className="flex items-center justify-end">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Updated: {formatValue("updatedAt", supplier.updatedAt)}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-180px)] overflow-y-auto">
        {/* Company & Contact */}
        <Section title="Company & Contact">
          <Grid>
            <Detail
              label="Company"
              value={formatValue("company", supplier.company)}
            />
            <Detail
              label="Contact Person"
              value={formatValue("contactPerson", supplier.contactPerson)}
            />
            <Detail
              label="Phone"
              value={formatValue("phone", supplier.phone)}
            />
            <Detail
              label="Email"
              value={formatValue("email", supplier.email)}
            />
            <Detail
              label="Supplier Code"
              value={formatValue("supplierCode", supplier.supplierCode)}
            />
            <Detail
              label="Rating"
              value={formatValue("rating", supplier.rating)}
            />
            <Detail
              label="Status"
              value={formatValue("isActive", supplier.isActive)}
            />
            <Detail
              label="Address"
              value={formatValue("address", supplier.address)}
            />
            <Detail label="City" value={formatValue("city", supplier.city)} />
            <Detail
              label="Country"
              value={formatValue("country", supplier.country)}
            />
            <Detail
              label="Postal Code"
              value={formatValue("postalCode", supplier.postalCode)}
            />
            <Detail
              label="Website"
              value={formatValue("website", supplier.website)}
            />
            <Detail
              label="BIN Number"
              value={formatValue("binNumber", supplier.binNumber)}
            />
            <Detail
              label="TIN Number"
              value={formatValue("tinNumber", supplier.tinNumber)}
            />
            <Detail
              label="VAT Registration"
              value={formatValue(
                "vatRegistrationNumber",
                supplier.vatRegistrationNumber
              )}
            />
            <Detail
              label="Trade License"
              value={formatValue(
                "tradeLicenseNumber",
                supplier.tradeLicenseNumber
              )}
            />
            <Detail
              label="Bank Name"
              value={formatValue("bankName", supplier.bankName)}
            />
            <Detail
              label="Account Number"
              value={formatValue(
                "bankAccountNumber",
                supplier.bankAccountNumber
              )}
            />
            <Detail
              label="Payment Terms"
              value={formatValue("paymentTerms", supplier.paymentTerms)}
            />
          </Grid>
        </Section>

        {/* Notes */}
        {supplier.notes && (
          <Section title="Internal Notes">
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-primary leading-relaxed max-h-32 overflow-y-auto">
                    {supplier.notes}
                  </p>
                </div>
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-gradient-to-r from-primary to-green-950 text-white rounded-lg  text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
          aria-label="Close Supplier Information"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Close
        </button>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 flex items-center">
      <svg
        className="w-5 h-5 mr-2 text-primary"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      {title}
    </h2>
    {children}
  </section>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </span>
    <span className="text-gray-900 font-medium text-sm">{value}</span>
  </div>
);

export default ViewSupplierInvoice;
