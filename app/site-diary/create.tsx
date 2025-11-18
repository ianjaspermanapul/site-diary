import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import CustomText from '@/components/ui/CustomText';
import { TextInput } from '@/components/ui/TextInput';
import { DatePickerModal } from '@/components/ui/DatePickerModal';
import { NetworkError, GraphQLError } from '@/lib/graphql/client';
import { formatDateString } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  siteDiaryValidationSchema,
  getInitialValues,
  SiteDiaryFormValues,
} from '@/lib/validation/siteDiarySchema';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useCreateSiteDiary } from '@/hooks/site-diary/useCreateSiteDiary';

export default function CreateSiteDiary() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOffline } = useNetworkStatus();
  const { createSiteDiary, isCreating, error: mutationError, reset } = useCreateSiteDiary();
  const [newAttendee, setNewAttendee] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleError = (error: Error) => {
    console.error('Error creating site diary:', error);

    let errorMessage = 'Failed to create site diary. Please try again.';
    let errorTitle = 'Error';

    if (error instanceof NetworkError) {
      errorTitle = 'Connection Error';
      errorMessage =
        error.message ||
        'Unable to connect to the server. Please check your internet connection and try again.';
    } else if (error instanceof GraphQLError) {
      errorTitle = 'Validation Error';
      errorMessage = error.message || 'Invalid data. Please check your input and try again.';
    } else if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        errorTitle = 'Timeout';
        errorMessage =
          'The request took too long. Please check your internet connection and try again.';
      } else if (error.message.includes('Network') || error.message.includes('connection')) {
        errorTitle = 'Connection Error';
        errorMessage =
          'Unable to connect to the server. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
    }

    Alert.alert(errorTitle, errorMessage, [{ text: 'OK', style: 'default', onPress: reset }]);
  };

  const formik = useFormik<SiteDiaryFormValues>({
    initialValues: getInitialValues(),
    validationSchema: siteDiaryValidationSchema,
    onSubmit: async (values) => {
      if (isOffline) {
        Alert.alert('Offline', 'You need an internet connection to create a site diary.');
        return;
      }

      try {
        const id = `cm${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

        await createSiteDiary({
          id,
          date: values.date,
          title: values.title.trim(),
          createdBy: 'Current User', // TODO: Get from auth context
          content: values.content?.trim() || undefined,
          weather:
            values.weatherCondition || values.temperature
              ? {
                  temperature: values.temperature ? parseInt(values.temperature, 10) : 20,
                  description: values.weatherCondition || 'sunny',
                }
              : undefined,
          attendees: values.attendees && values.attendees.length > 0 ? values.attendees : undefined,
          attachments:
            values.attachments && values.attachments.length > 0 ? values.attachments : undefined,
        });

        Alert.alert('Success', 'Site diary created successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } catch (error) {
        if (error instanceof Error) {
          handleError(error);
        } else {
          handleError(new Error('An unexpected error occurred'));
        }
      }
    },
  });

  const addAttendee = () => {
    if (newAttendee.trim()) {
      const currentAttendees = formik.values.attendees || [];
      formik.setFieldValue('attendees', [...currentAttendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  const removeAttendee = (index: number) => {
    const currentAttendees = formik.values.attendees || [];
    formik.setFieldValue(
      'attendees',
      currentAttendees.filter((_, i) => i !== index)
    );
  };

  const handleDateChange = (date: Date) => {
    formik.setFieldValue('date', date.toISOString().split('T')[0]);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add photos!', [
        { text: 'OK' },
      ]);
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets) {
      const currentAttachments = formik.values.attachments || [];
      const newUris = result.assets.map((asset) => asset.uri);
      formik.setFieldValue('attachments', [...currentAttachments, ...newUris]);
    }
  };

  const removeAttachment = (index: number) => {
    const currentAttachments = formik.values.attachments || [];
    formik.setFieldValue(
      'attachments',
      currentAttachments.filter((_, i) => i !== index)
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'New Site Diary',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <CustomText variant="secondary" style={styles.headerButtonText}>
                Cancel
              </CustomText>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#F2F2F2',
          },
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            {/* Date */}
            <View style={styles.section}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  label="Date"
                  value={formatDateString(formik.values.date, 'D MMM YYYY')}
                  editable={false}
                  placeholder="Select date"
                  suffixIcon="calendar-outline"
                  pointerEvents="none"
                  error={formik.touched.date && formik.errors.date ? formik.errors.date : undefined}
                />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <TextInput
                label="Title"
                placeholder="e.g., Foundation Pouring Day"
                value={formik.values.title}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                error={
                  formik.touched.title && formik.errors.title ? formik.errors.title : undefined
                }
              />
            </View>

            {/* Diary Content */}
            <View style={styles.section}>
              <TextInput
                label="Diary Content/Notes"
                placeholder="Add your notes here..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={formik.values.content || ''}
                onChangeText={formik.handleChange('content')}
                onBlur={formik.handleBlur('content')}
                containerStyle={styles.textAreaContainer}
                error={
                  formik.touched.content && formik.errors.content
                    ? formik.errors.content
                    : undefined
                }
              />
            </View>

            {/* Weather */}
            <View style={styles.section}>
              <CustomText variant="label" style={styles.label}>
                Weather
              </CustomText>
              <View style={styles.weatherRow}>
                <View style={styles.weatherColumn}>
                  <TextInput
                    label="Condition"
                    labelVariant="labelSmall"
                    value={formik.values.weatherCondition || ''}
                    onChangeText={formik.handleChange('weatherCondition')}
                    onBlur={formik.handleBlur('weatherCondition')}
                    prefixIcon="sunny"
                    prefixIconColor="#f59e0b"
                    containerStyle={styles.weatherInputContainer}
                    error={
                      formik.touched.weatherCondition && formik.errors.weatherCondition
                        ? formik.errors.weatherCondition
                        : undefined
                    }
                  />
                </View>
                <View style={styles.weatherColumn}>
                  <TextInput
                    label="Temperature"
                    labelVariant="labelSmall"
                    value={formik.values.temperature || ''}
                    onChangeText={formik.handleChange('temperature')}
                    onBlur={formik.handleBlur('temperature')}
                    keyboardType="numeric"
                    prefixIcon="thermometer"
                    prefixIconColor="#ef4444"
                    suffixText="°C"
                    containerStyle={styles.weatherInputContainer}
                    error={
                      formik.touched.temperature && formik.errors.temperature
                        ? formik.errors.temperature
                        : undefined
                    }
                  />
                </View>
              </View>
            </View>

            {/* Attendees */}
            <View style={styles.section}>
              <CustomText variant="label" style={styles.label}>
                Attendees
              </CustomText>
              <View style={styles.attendeeInputContainer}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Add attendee name or email"
                    value={newAttendee}
                    onChangeText={setNewAttendee}
                    onSubmitEditing={addAttendee}
                    containerStyle={styles.attendeeInput}
                  />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={addAttendee}>
                  <CustomText variant="bodyMedium" style={styles.addButtonText}>
                    + Add
                  </CustomText>
                </TouchableOpacity>
              </View>
              {formik.touched.attendees && formik.errors.attendees && (
                <CustomText variant="secondarySmall" style={styles.errorText}>
                  {formik.errors.attendees}
                </CustomText>
              )}
              {(formik.values.attendees || []).map((attendee, index) => (
                <View key={index} style={styles.attendeeItem}>
                  <View style={styles.attendeeAvatar}>
                    <CustomText variant="avatar">
                      {attendee
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </CustomText>
                  </View>
                  <View style={styles.attendeeInfo}>
                    <CustomText variant="bodyMedium">{attendee}</CustomText>
                  </View>
                  <TouchableOpacity onPress={() => removeAttendee(index)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Attachments */}
            <View style={styles.section}>
              <CustomText variant="label" style={styles.label}>
                Attachments
              </CustomText>
              <View style={styles.attachmentsContainer}>
                {(formik.values.attachments || []).map((uri, index) => (
                  <View key={index} style={styles.attachmentThumbnail}>
                    <Image source={{ uri }} style={styles.attachmentImage} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removeAttachmentButton}
                      onPress={() => removeAttachment(index)}>
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addAttachmentButton} onPress={pickImage}>
                  <Ionicons name="camera-outline" size={24} color="#6b7280" />
                  <CustomText variant="secondarySmall" style={styles.addAttachmentText}>
                    Add Photo
                  </CustomText>
                </TouchableOpacity>
              </View>
              {formik.touched.attachments && formik.errors.attachments && (
                <CustomText variant="secondarySmall" style={styles.errorText}>
                  {formik.errors.attachments}
                </CustomText>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
            <CustomText variant="secondarySmall" style={styles.offlineText}>
              You're offline. Internet connection required to save.
            </CustomText>
          </View>
        )}
        <TouchableOpacity
          style={[styles.saveButton, (isCreating || isOffline) && styles.saveButtonDisabled]}
          onPress={() => formik.handleSubmit()}
          disabled={isCreating || isOffline}>
          <CustomText variant="bodyMedium" style={styles.saveButtonText}>
            {isOffline ? 'Offline - Cannot Save' : isCreating ? 'Saving...' : 'Save Diary'}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        value={new Date(formik.values.date)}
        onChange={handleDateChange}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    margin: 16,
    borderRadius: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  textAreaContainer: {
    minHeight: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  weatherRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weatherColumn: {
    flex: 1,
  },
  weatherInputContainer: {
    minHeight: 48,
  },
  attendeeInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  attendeeInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeInfo: {
    flex: 1,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attachmentThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  addAttachmentButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  addAttachmentText: {
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    borderRadius: 8,
  },
  offlineText: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerButtonText: {
    color: '#6366f1',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
  },
});
