import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../theme/tokens';
import StorageUtils from '../lib/StorageUtils';
import { apiClient } from '../lib/api';
import { useCycleStore } from '../store/useCycleStore';

interface UserData {
  uid: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

interface UserProfileProps {
  onUserChange?: (userData: UserData | null) => void;
}

export default function UserProfile({ onUserChange }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const clearData = useCycleStore(state => state.clearData);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
        setIsLoading(true);
        const data = await StorageUtils.getUserData();
        setUserData(data);
        setEditName(data && data.name ? data.name : '');
        if (onUserChange) {
          onUserChange(data);
        }
      } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!userData || !editName.trim()) return;

    try {
      // Update local storage
      const updatedUserData = { ...userData, name: editName.trim() };
      await StorageUtils.saveUserData(updatedUserData);
      
      // Update server if user is authenticated
      const accessKey = await StorageUtils.getAccessKey();
      if (accessKey) {
        await apiClient.updateUserProfile({ name: editName.trim() });
      }
      
      setUserData(updatedUserData);
      setIsEditing(false);
      if (onUserChange) {
        onUserChange(updatedUserData);
      }
    } catch (error) {
      console.error('Failed to save name:', error);
      Alert.alert('Error', 'Failed to save name. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Your data will be cleared from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.logout();
              clearData(); // Clear store data
              setUserData(null);
              if (onUserChange) {
                onUserChange(null);
              }
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <View style={styles.noUserContainer}>
          <Ionicons name="person-circle-outline" size={64} color={colors.gray300} />
          <Text style={styles.noUserTitle}>No Account</Text>
          <Text style={styles.noUserDesc}>
            Create an account to sync your data across devices
          </Text>
          <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={64} color={colors.primary} />
        </View>
        
        <View style={styles.userInfo}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.nameInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setEditName(userData.name || '');
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.displayContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{userData.name || 'Anonymous User'}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userEmail}>{userData.email || 'No email'}</Text>
              <Text style={styles.userId}>ID: {userData.uid}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    margin: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing(4),
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  noUserContainer: {
    alignItems: 'center',
    paddingVertical: spacing(4),
  },
  noUserTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  noUserDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing(3),
  },
  createAccountButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.medium,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
  },
  createAccountText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing(3),
  },
  avatarContainer: {
    marginRight: spacing(2),
  },
  userInfo: {
    flex: 1,
  },
  displayContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(0.5),
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing(1),
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing(0.5),
  },
  userId: {
    ...typography.small,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  editContainer: {
    flex: 1,
  },
  nameInput: {
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    padding: spacing(1.5),
    ...typography.body,
    color: colors.text,
    marginBottom: spacing(2),
  },
  editButtons: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    paddingVertical: spacing(1),
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.caption,
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.medium,
    paddingVertical: spacing(1),
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    paddingTop: spacing(2),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red + '10',
    borderRadius: radii.medium,
    paddingVertical: spacing(1.5),
  },
  logoutText: {
    ...typography.caption,
    color: colors.red,
    fontWeight: '600',
    marginLeft: spacing(0.5),
  },
});