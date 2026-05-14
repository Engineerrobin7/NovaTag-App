import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
          <StatusBar style="dark" />
          <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-6">
            <MaterialCommunityIcons name="alert-octagon" size={40} color="#ff3b30" />
          </View>
          <Text className="text-black text-2xl font-bold text-center">Something went wrong</Text>
          <Text className="text-gray-500 text-center mt-4 mb-10 leading-6">
            An unexpected error occurred. Our team has been notified. Please try restarting the app.
          </Text>
          
          <Pressable 
            onPress={this.handleReset}
            className="bg-black px-10 py-4 rounded-2xl w-full items-center"
          >
            <Text className="text-white font-bold text-lg">Try Again</Text>
          </Pressable>
          
          <View className="mt-8 p-4 bg-gray-50 rounded-2xl w-full border border-gray-100">
            <Text className="text-gray-400 text-xs font-mono" numberOfLines={3}>
              {this.state.error?.toString()}
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
