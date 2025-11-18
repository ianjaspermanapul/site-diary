import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/ui/CustomText';
import { useWeeklySummary } from '@/hooks/site-diary/useWeeklySummary';
import { NetworkError } from '@/lib/graphql/client';

interface WeeklySummaryModalProps {
  visible: boolean;
  onClose: () => void;
}

function LoadingState() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <CustomText variant="secondary" style={styles.loadingText}>
        Generating summary...
      </CustomText>
    </View>
  );
}

function ApiKeyMissingState() {
  return (
    <View style={styles.centerContainer}>
      <Ionicons name="key-outline" size={48} color="#6b7280" />
      <CustomText variant="bodyMedium" style={styles.errorText}>
        AI Summary Feature Not Available
      </CustomText>
      <CustomText variant="secondary" style={styles.infoText}>
        To enable weekly AI summaries, please add your OPENAI_API_KEY to the .env file.
      </CustomText>
    </View>
  );
}

function ErrorState({ 
  error, 
  onRetry, 
  isOffline 
}: { 
  error: Error; 
  onRetry: () => void;
  isOffline?: boolean;
}) {
  const getErrorMessage = () => {
    if (error instanceof NetworkError) {
      return isOffline
        ? 'You\'re offline. Weekly summaries require an internet connection.'
        : 'Unable to generate summary. Please check your internet connection.';
    }
    return error.message || 'Failed to generate summary. Please try again.';
  };

  return (
    <View style={styles.centerContainer}>
      <Ionicons 
        name={isOffline ? "cloud-offline-outline" : "alert-circle-outline"} 
        size={48} 
        color="#ef4444" 
      />
      <CustomText variant="bodyMedium" style={styles.errorText}>
        {getErrorMessage()}
      </CustomText>
      {!isOffline && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <CustomText variant="bodyMedium" style={styles.retryButtonText}>
            Retry
          </CustomText>
        </TouchableOpacity>
      )}
      {isOffline && (
        <CustomText variant="secondarySmall" style={styles.infoText}>
          Connect to the internet to generate weekly summaries
        </CustomText>
      )}
    </View>
  );
}

function SummaryContent({ summary }: { summary: string }) {
  return (
    <View style={styles.summaryContainer}>
      <CustomText variant="body" style={styles.summaryText}>
        {summary}
      </CustomText>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.centerContainer}>
      <CustomText variant="secondary">No summary available</CustomText>
    </View>
  );
}

export function WeeklySummaryModal({ visible, onClose }: WeeklySummaryModalProps) {
  const { summary, loading, error, refetch, isApiKeyMissing, isOffline } = useWeeklySummary();

  const renderContent = (
    loading: boolean,
    isApiKeyMissing: boolean,
    error: Error | null | undefined,
    summary: string | null | undefined,
    onRetry: () => void,
    isOffline?: boolean
  ) => {
    if (loading) return <LoadingState />;
    if (isApiKeyMissing) return <ApiKeyMissingState />;
    if (error) return <ErrorState error={error} onRetry={onRetry} isOffline={isOffline} />;
    if (summary) return <SummaryContent summary={summary} />;
    return <EmptyState />;
  };

  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible, refetch]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <CustomText variant="sectionTitle">Weekly Summary</CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderContent(loading, isApiKeyMissing, error, summary, refetch, isOffline)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 8,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryText: {
    lineHeight: 24,
    color: '#374151',
  },
});
