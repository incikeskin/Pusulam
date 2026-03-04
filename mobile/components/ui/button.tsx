// mobile/components/ui/button.tsx
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: "default" | "outline";
    size?: "sm" | "md" | "lg";
    className?: string; // tailwind class için opsiyonel
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  onPress,
                                                  variant = "default",
                                                  size = "md",
                                                  className = "",
                                              }) => {
    let padding: string;
    switch (size) {
        case "sm":
            padding = "px-3 py-1";
            break;
        case "lg":
            padding = "px-6 py-3";
            break;
        case "md":
        default:
            padding = "px-4 py-2";
            break;
    }

    const baseStyle = `${padding} rounded-xl items-center justify-center ${
        variant === "default"
            ? "bg-[#1087BB] text-white"
            : "border border-[#1087BB] text-[#1087BB]"
    } ${className}`;

    return (
        <TouchableOpacity onPress={onPress} className={baseStyle}>
            <Text className={variant === "default" ? "text-white" : "text-[#1087BB]"}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};