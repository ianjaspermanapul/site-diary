import React from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';

interface TextInputComponentProps extends TextInputProps {
  label?: string;
  labelVariant?: 'label' | 'labelSmall';
  prefixIcon?: keyof typeof Ionicons.glyphMap;
  suffixIcon?: keyof typeof Ionicons.glyphMap;
  prefixIconColor?: string;
  suffixIconColor?: string;
  prefixText?: string;
  suffixText?: string;
  onSuffixPress?: () => void;
  containerStyle?: object;
  labelStyle?: object;
  error?: string;
}

export const TextInput = ({
  label,
  labelVariant = 'label',
  prefixIcon,
  suffixIcon,
  prefixIconColor = '#6b7280',
  suffixIconColor = '#6b7280',
  prefixText,
  suffixText,
  onSuffixPress,
  containerStyle,
  labelStyle,
  error,
  style,
  ...textInputProps
}: TextInputComponentProps) => {
  const hasPrefix = prefixIcon || prefixText;
  const hasSuffix = suffixIcon || suffixText;
  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      {label && (
        <CustomText variant={labelVariant} style={[styles.label, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View style={[styles.container, hasError && styles.containerError, containerStyle]}>
        {hasPrefix && (
          <View style={styles.prefixContainer}>
            {prefixIcon && <Ionicons name={prefixIcon} size={20} color={prefixIconColor} />}
            {prefixText && <Text style={styles.prefixText}>{prefixText}</Text>}
          </View>
        )}
        <RNTextInput
          style={[
            styles.input,
            hasPrefix && styles.inputWithPrefix,
            hasSuffix && styles.inputWithSuffix,
            style,
          ]}
          placeholderTextColor="#9ca3af"
          {...textInputProps}
        />
        {hasSuffix && (
          <TouchableOpacity
            onPress={onSuffixPress}
            disabled={!onSuffixPress}
            style={styles.suffixContainer}
            activeOpacity={onSuffixPress ? 0.7 : 1}>
            {suffixIcon && <Ionicons name={suffixIcon} size={20} color={suffixIconColor} />}
            {suffixText && <Text style={styles.suffixText}>{suffixText}</Text>}
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <CustomText variant="secondarySmall" style={styles.errorText}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    minHeight: 48,
  },
  containerError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  inputWithPrefix: {
    marginLeft: 8,
  },
  inputWithSuffix: {
    marginRight: 8,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suffixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: 16,
    color: '#111827',
  },
  suffixText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
  },
});

export default TextInput;
