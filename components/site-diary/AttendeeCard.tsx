import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/ui/CustomText';

interface Props {
  name: string;
  role?: string;
}

export const AttendeeCard = ({ name, role }: Props) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <CustomText variant="avatar">{initials}</CustomText>
      </View>
      <View style={styles.info}>
        <CustomText variant="bodyMedium" style={styles.name}>
          {name}
        </CustomText>
        {role && <CustomText variant="secondarySmall">{role}</CustomText>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
});
