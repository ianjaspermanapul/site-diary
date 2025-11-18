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
import { graphqlRequest } from '@/lib/graphql/client';
import { CREATE_SITE_DIARY } from '@/lib/graphql/queries';
import { formatDateString } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  siteDiaryValidationSchema,
  getInitialValues,
  SiteDiaryFormValues,
} from '@/lib/validation/siteDiarySchema';

export default function CreateSiteDiary() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [newAttendee, setNewAttendee] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formik = useFormik<SiteDiaryFormValues>({
    initialValues: getInitialValues(),
    validationSchema: siteDiaryValidationSchema,
    onSubmit: async (values) => {
      try {
        const id = `cm${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

        await graphqlRequest(CREATE_SITE_DIARY, {
          input: {
            id,
            date: values.date,
            title: values.title.trim(),
            createdBy: 'Current User', // TODO: Get from auth context
          },
        });

        Alert.alert('Success', 'Site diary created successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } catch (error) {
        console.error('Error creating site diary:', error);
        Alert.alert('Error', 'Failed to create site diary. Please try again.');
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
        <TouchableOpacity
          style={[styles.saveButton, formik.isSubmitting && styles.saveButtonDisabled]}
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}>
          <CustomText variant="bodyMedium" style={styles.saveButtonText}>
            {formik.isSubmitting ? 'Saving...' : 'Save Diary'}
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
