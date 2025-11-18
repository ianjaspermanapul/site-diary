import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSiteDiary } from '@/hooks/site-diary/useSiteDiary';
import { SiteDiaryDetails } from '@/components/site-diary/SiteDiaryDetails';

export default function SiteDiaryDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { siteDiary, loading, error } = useSiteDiary(id as string);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Site Diary',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#F2F2F2',
          },
        }}
      />
      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      ) : siteDiary ? (
        <SiteDiaryDetails siteDiary={siteDiary} />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Site diary not found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {},
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});
