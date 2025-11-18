import * as React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

const styles = StyleSheet.create({
  // Title variants
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },

  // Section heading
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  // Body text variants
  body: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  // Secondary text variants
  secondary: {
    fontSize: 16,
    color: '#6b7280',
  },
  secondarySmall: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Label variants
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  labelSmall: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Avatar text
  avatar: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

type Variant =
  | 'title'
  | 'titleLarge'
  | 'sectionTitle'
  | 'body'
  | 'bodyMedium'
  | 'bodyLarge'
  | 'secondary'
  | 'secondarySmall'
  | 'label'
  | 'labelSmall'
  | 'avatar';

export interface TextProps extends React.ComponentProps<typeof RNText> {
  variant?: Variant;
}

const CustomText = ({ variant = 'body', style, ...props }: TextProps) => {
  return <RNText style={[styles[variant], style]} {...props} />;
};

export default CustomText;
