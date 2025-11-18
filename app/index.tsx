import { Stack, useRouter } from 'expo-router';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Container } from '@/components/Container';
import SiteDiaryListItem from '@/components/site-diary/SiteDiaryListItem';
import SiteDiaryListItemSkeleton from '@/components/site-diary/SiteDiaryListItemSkeleton';
import { SiteDiary } from './api/graphql+api';
import { useSiteDiaries } from '@/hooks/site-diary/useSiteDiaries';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function Home() {
  const router = useRouter();
  const { siteDiaries, loading, error, refetch, isRefetching, isOffline } = useSiteDiaries();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !isOffline) {
      refetch();
    }
  }, [isFocused, isOffline]);

  const renderItem = ({ item }: ListRenderItemInfo<SiteDiary>) => {
    return <SiteDiaryListItem details={item} />;
  };

  const handleAddPress = () => {
    if (isOffline) {
      Alert.alert('Offline', 'You need an internet connection to create a site diary.');
      return;
    }
    router.push('/site-diary/create');
  };

  if (error && !isOffline) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Site Diaries' }} />
        <Container>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Site Diaries',
          headerStyle: { backgroundColor: '#F2F2F2' },
        }}
      />
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
          <Text style={styles.offlineText}>You're offline. Showing cached data.</Text>
        </View>
      )}
      <View style={styles.content}>
        {loading ? (
          <SiteDiaryListItemSkeleton />
        ) : (
          <FlatList
            data={siteDiaries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            onRefresh={!isOffline ? refetch : undefined}
            refreshing={isRefetching}
            ListEmptyComponent={
              isOffline && siteDiaries.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No cached data available</Text>
                  <Text style={styles.emptySubtext}>
                    Connect to the internet to load site diaries
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.fab, isOffline && styles.fabDisabled]}
        onPress={handleAddPress}
        activeOpacity={0.8}
        disabled={isOffline}>
        <Ionicons name="add" size={24} color={isOffline ? '#9ca3af' : 'white'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android shadow
    elevation: 8,
  },
  fabDisabled: {
    backgroundColor: '#e5e7eb',
  },
});
