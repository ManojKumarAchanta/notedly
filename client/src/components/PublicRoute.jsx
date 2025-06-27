// src/components/PublicRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const token = useSelector((state) => state.auth.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
