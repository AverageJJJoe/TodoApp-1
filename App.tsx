import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from './src/lib/supabase';

export default function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing connection...');

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        // Attempt a query - table doesn't exist yet, but should get "table not found" not connection error
        const { data, error } = await supabase.from('test').select('1');
        
        if (error) {
          // If we get an error about table not existing/found, connection is working
          // Supabase returns different error messages for missing tables:
          // - "does not exist"
          // - "Could not find the table"
          // - Error code '42P01' or 'PGRST116'
          const isTableNotFound = 
            error.message.includes('does not exist') ||
            error.message.includes('Could not find the table') ||
            error.message.includes('not found') ||
            error.code === '42P01' ||
            error.code === 'PGRST116';
          
          if (isTableNotFound) {
            const successMsg = '✅ Supabase connection successful! (Table does not exist, which is expected)';
            console.log(successMsg);
            setConnectionStatus(successMsg);
            Alert.alert('Success!', 'Supabase connection is working! The "table not found" error confirms the connection is successful.');
          } else {
            const errorMsg = `❌ Supabase connection error: ${error.message}`;
            console.error(errorMsg);
            setConnectionStatus(errorMsg);
            Alert.alert('Connection Error', error.message);
          }
        } else {
          const successMsg = '✅ Supabase connection successful!';
          console.log(successMsg);
          setConnectionStatus(successMsg);
          Alert.alert('Success!', 'Supabase connection is working!');
        }
      } catch (err: any) {
        const errorMsg = `❌ Failed to connect to Supabase: ${err?.message || err}`;
        console.error(errorMsg);
        setConnectionStatus(errorMsg);
        Alert.alert('Connection Failed', err?.message || 'Unknown error');
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.status}>{connectionStatus}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
