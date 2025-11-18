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
import { WeeklySummaryModal } from '@/components/site-diary/WeeklySummaryModal';
import { SiteDiary } from './api/graphql+api';
import { useSiteDiaries } from '@/hooks/site-diary/useSiteDiaries';
import { useWeeklySummary } from '@/hooks/site-diary/useWeeklySummary';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { NetworkError } from '@/lib/graphql/client';

export default function Home() {
  const router = useRouter();
  const { siteDiaries, loading, error, refetch, isRefetching, isOffline } = useSiteDiaries();
  const { isApiKeyMissing, refetch: checkApiKey } = useWeeklySummary();
  const isFocused = useIsFocused();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [hasCheckedApiKey, setHasCheckedApiKey] = useState(false);

  console.log('siteDiaries: ', siteDiaries);

  // Check API key availability once on mount
  useEffect(() => {
    if (!hasCheckedApiKey && !isOffline) {
      // Try to fetch summary to check if API key is available
      checkApiKey().finally(() => {
        setHasCheckedApiKey(true);
      });
    }
  }, [hasCheckedApiKey, isOffline, checkApiKey]);

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

  const getErrorMessage = () => {
    if (!error) return '';

    if (error instanceof NetworkError) {
      return isOffline
        ? "You're offline. Showing cached data."
        : 'Unable to load site diaries. Please check your internet connection.';
    }

    if (error instanceof Error) {
      if (error.message.includes('Network') || error.message.includes('connection')) {
        return isOffline
          ? "You're offline. Showing cached data."
          : 'Unable to load site diaries. Please check your internet connection.';
      }
      return error.message;
    }

    return 'Failed to load site diaries. Please try again.';
  };

  if (error && !isOffline && siteDiaries.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Site Diaries' }} />
        <Container>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{getErrorMessage()}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Ionicons name="refresh" size={16} color="#fff" style={styles.retryIcon} />
              <Text style={styles.retryButtonText}>{isRefetching ? 'Retrying...' : 'Retry'}</Text>
            </TouchableOpacity>
          </View>
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
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowSummaryModal(true)} style={styles.headerButton}>
              <Ionicons name="sparkles-outline" size={24} color="#6366f1" />
            </TouchableOpacity>
          ),
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

      <WeeklySummaryModal visible={showSummaryModal} onClose={() => setShowSummaryModal(false)} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  retryIcon: {
    marginRight: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
});
