import React from "react";
import { type FieldError } from "react-hook-form";

export interface ErrorProps {
    error?: FieldError;
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
    if (!error) return null;

    return <p className="text-red-500 text-sm">{error.message}</p>;
};
