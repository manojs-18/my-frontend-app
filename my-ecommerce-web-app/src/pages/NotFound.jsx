import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Button from "../components/common/Button";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <HiOutlineExclamationCircle className="mb-4 h-16 w-16 text-indigo-200" />
    <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
    <p className="mt-2 max-w-sm text-sm text-gray-500">
      The page you're looking for doesn't exist or you don't have access to it.
    </p>
    <Link to="/" className="mt-6">
      <Button>Back to Home</Button>
    </Link>
  </div>
);

export default NotFound;
