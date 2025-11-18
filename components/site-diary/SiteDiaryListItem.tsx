import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SiteDiary } from '@/app/api/graphql+api';
import { formatDateString } from '@/lib/utils/date';
import { router } from 'expo-router';

interface Props {
  details: SiteDiary;
}

const SiteDiaryListItem = ({ details }: Props) => {
  const { title, date } = details;
  const formattedDate = formatDateString(date);

  const onPress = () => {
    router.push({
      pathname: '/site-diary/[id]',
      params: { id: String(details.id) },
    });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text>{title}</Text>
          <Text>{formattedDate}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
};

export default SiteDiaryListItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    // Android shadow
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
