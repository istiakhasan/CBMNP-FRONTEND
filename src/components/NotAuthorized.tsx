"use client";
import Link from "next/link";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const NotAuthorized = () => {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="not-authorized-container">
      <div className="content">
        <h1>403 - Not Authorized</h1>
        <p>You don’t have permission to view this page.</p>
        <div className="actions">
          <Button type="primary" onClick={() => router.back()}>
            Go Back
          </Button>
          <Link href={`/${locale}/dashboard`}>
            <Button type="default" className="ml-2">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .not-authorized-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f9f9f9;
          text-align: center;
          padding: 20px;
        }

        .content {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 36px;
          margin-bottom: 16px;
          color: #ff4d4f;
        }

        p {
          font-size: 16px;
          color: #555;
          margin-bottom: 24px;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ml-2 {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default NotAuthorized;
