import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import CustomText from '@/components/ui/CustomText';

import { useSiteDiary } from '@/hooks/site-diary/useSiteDiary';
import { SiteDiaryDetails } from '@/components/site-diary/SiteDiaryDetails';
import { NetworkError } from '@/lib/graphql/client';

// Loading State Component
function LoadingState() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <CustomText variant="secondary" style={styles.loadingText}>
        Loading site diary...
      </CustomText>
    </View>
  );
}

// Error State Component
function ErrorState({
  error,
  isOffline,
  isRefetching,
  onRetry,
}: {
  error: Error;
  isOffline: boolean;
  isRefetching: boolean;
  onRetry: () => void;
}) {
  const errorMessage = useMemo(() => {
    if (error instanceof NetworkError) {
      return isOffline
        ? "You're offline. This site diary is not available in cache."
        : 'Unable to load site diary. Please check your internet connection.';
    }
    return error.message || 'Failed to load site diary. Please try again.';
  }, [error, isOffline]);

  const iconName = isOffline ? 'cloud-offline-outline' : 'alert-circle-outline';

  return (
    <View style={styles.centerContainer}>
      <Ionicons name={iconName} size={48} color="#ef4444" />
      <CustomText variant="bodyMedium" style={styles.errorText}>
        {errorMessage}
      </CustomText>
      {!isOffline && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color="#fff" style={styles.retryIcon} />
          <CustomText variant="bodyMedium" style={styles.retryButtonText}>
            {isRefetching ? 'Retrying...' : 'Retry'}
          </CustomText>
        </TouchableOpacity>
      )}
      {isOffline && (
        <CustomText variant="secondarySmall" style={styles.offlineHint}>
          Connect to the internet to view this site diary
        </CustomText>
      )}
    </View>
  );
}

// Not Found State Component
function NotFoundState() {
  return (
    <View style={styles.centerContainer}>
      <Ionicons name="document-outline" size={48} color="#6b7280" />
      <CustomText variant="bodyMedium" style={styles.errorText}>
        Site diary not found
      </CustomText>
    </View>
  );
}

export default function SiteDiaryDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { siteDiary, loading, error, refetch, isRefetching, isOffline } = useSiteDiary(
    id as string
  );

  // Determine which content to render - early return pattern
  const content = useMemo(() => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <ErrorState
          error={error}
          isOffline={isOffline}
          isRefetching={isRefetching}
          onRetry={refetch}
        />
      );
    }

    if (siteDiary) {
      return <SiteDiaryDetails siteDiary={siteDiary} />;
    }

    return <NotFoundState />;
  }, [loading, error, siteDiary, isOffline, isRefetching, refetch]);

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
      {content}
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
    padding: 32,
    gap: 16,
  },
  headerButton: {},
  loadingText: {
    marginTop: 16,
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
  offlineHint: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 8,
  },
});
