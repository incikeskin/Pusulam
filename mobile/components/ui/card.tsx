// mobile/components/ui/card.tsx
import React from "react";
import { View, Text, ViewProps, TextProps } from "react-native";

// Card kapsayıcı
export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
    return (
        <View
            style={[{ backgroundColor: "#fff", padding: 16, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }, style]}
            {...props}
        >
            {children}
        </View>
    );
};

// Card header
export const CardHeader: React.FC<ViewProps> = ({ children, style, ...props }) => {
    return (
        <View style={[{ marginBottom: 8 }, style]} {...props}>
            {children}
        </View>
    );
};

// Card başlığı
export const CardTitle: React.FC<TextProps> = ({ children, style, ...props }) => {
    return (
        <Text style={[{ fontSize: 18, fontWeight: "bold", color: "#1087BB" }, style]} {...props}>
            {children}
        </Text>
    );
};

// Card içeriği
export const CardContent: React.FC<ViewProps> = ({ children, style, ...props }) => {
    return <View style={[{ marginTop: 8 }, style]} {...props}>{children}</View>;
};