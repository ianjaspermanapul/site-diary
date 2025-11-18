import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Weather } from '@/app/api/graphql+api';
import CustomText from '@/components/ui/CustomText';

interface Props {
  weather: Weather;
}

export const WeatherCard = ({ weather }: Props) => {
  return (
    <View style={styles.container}>
      <Ionicons name="sunny" size={24} color="#f59e0b" />
      <View style={styles.content}>
        <CustomText variant="bodyMedium" style={styles.description}>
          {weather.description}
        </CustomText>
        <CustomText variant="label">Description</CustomText>
      </View>
      <View style={styles.temperatureContainer}>
        <Ionicons name="thermometer" size={20} color="#ef4444" />
        <CustomText variant="bodyLarge">{weather.temperature}°C</CustomText>
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  description: {
    marginBottom: 4,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
