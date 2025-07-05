// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import Checkbox from 'expo-checkbox';
// import { useEffect } from 'react';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ReportSubmit = ({ customer }) => {
//   const [gotTodayCow, setGotTodayCow] = useState(false);
//   const [gotTodayBuffalo, setGotTodayBuffalo] = useState(false);
//   const [willGetTomorrowCow, setWillGetTomorrowCow] = useState(false);
//   const [willGetTomorrowBuffalo, setWillGetTomorrowBuffalo] = useState(false);
//   const [extraToday, setExtraToday] = useState('');
//   const [extraTomorrow, setExtraTomorrow] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [employeeId, setEmployeeId] = useState(null);

//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       try {
//         const userStr = await AsyncStorage.getItem('user');

//         const user = JSON.parse(userStr);
//         if (user?.id) {

//           setEmployeeId(user.id);
//         } else {
//           Alert.alert('Error', 'Employee ID not found in storage.');
//         }
//       } catch (err) {

//         Alert.alert('Error', 'Failed to fetch employee info.');
//       }
//     };
//     fetchEmployeeId();
//   }, []);


//   const handleSubmit = async () => {
//     if (!customer?.id || !employeeId) {
//       Alert.alert('Missing Information', 'Customer or Employee ID missing.');
//       return;
//     }

//     try {
//       const response = await fetch('http://192.168.43.175:3000/api/add-daily-report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           customer_id: customer.id,
//           got_cow_milk_today: gotTodayCow,
//           got_buffalo_milk_today: gotTodayBuffalo,
//           will_get_cow_milk_tomorrow: willGetTomorrowCow,
//           will_get_buffalo_milk_tomorrow: willGetTomorrowBuffalo,
//           extra_today: parseFloat(extraToday || 0),
//           extra_tomorrow: parseFloat(extraTomorrow || 0),
//           assigned_employee_id: employeeId,
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setSubmitted(true);
//         Alert.alert('Success', 'Report submitted successfully!');
//       } else if (response.status === 409) {
//         Alert.alert('Duplicate', 'Report already submitted today for this customer.');
//       } else {
//         Alert.alert('Error', data.message || 'Failed to submit report');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Network error while submitting report');
//     }
//   };


//   return (
//     <View style={styles.reportBox}>
//       <Text style={styles.label}>Got milk today?</Text>
//       <View style={styles.checkboxRow}>
//         <Checkbox value={gotTodayCow} onValueChange={setGotTodayCow} />
//         <Text style={styles.checkboxLabel}>Cow</Text>
//         <Checkbox value={gotTodayBuffalo} onValueChange={setGotTodayBuffalo} style={{ marginLeft: 20 }} />
//         <Text style={styles.checkboxLabel}>Buffalo</Text>
//       </View>

//       <TextInput
//         placeholder="Extra milk today (L)"
//         keyboardType="numeric"
//         style={styles.input}
//         value={extraToday}
//         onChangeText={setExtraToday}
//       />

//       <Text style={styles.label}>Will get tomorrow?</Text>
//       <View style={styles.checkboxRow}>
//         <Checkbox value={willGetTomorrowCow} onValueChange={setWillGetTomorrowCow} />
//         <Text style={styles.checkboxLabel}>Cow</Text>
//         <Checkbox value={willGetTomorrowBuffalo} onValueChange={setWillGetTomorrowBuffalo} style={{ marginLeft: 20 }} />
//         <Text style={styles.checkboxLabel}>Buffalo</Text>
//       </View>

//       <TextInput
//         placeholder="Extra milk tomorrow (L)"
//         keyboardType="numeric"
//         style={styles.input}
//         value={extraTomorrow}
//         onChangeText={setExtraTomorrow}
//       />

//       <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
//         <Text style={styles.submitBtnText}>Submit</Text>
//       </TouchableOpacity>

//       {submitted && (
//         <Text style={styles.submittedText}>Information Submitted...</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   reportBox: {
//     margin: 16,
//     padding: 16,
//     backgroundColor: '#f4f4f4',
//     borderRadius: 8,
//   },
//   label: {
//     fontWeight: '600',
//     fontSize: 15,
//     marginBottom: 4,
//   },
//   checkboxRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   checkboxLabel: {
//     marginLeft: 6,
//     marginRight: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#aaa',
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 12,
//   },
//   submitBtn: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 10,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   submitBtnText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   submittedText: {
//     marginTop: 10,
//     color: '#16a34a',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });

// export default ReportSubmit;



import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportSubmit = ({ customer }) => {
  const [gotTodayCow, setGotTodayCow] = useState(false);
  const [gotTodayBuffalo, setGotTodayBuffalo] = useState(false);
  const [willGetTomorrowCow, setWillGetTomorrowCow] = useState(false);
  const [willGetTomorrowBuffalo, setWillGetTomorrowBuffalo] = useState(false);
  const [extraToday, setExtraToday] = useState('');
  const [extraTomorrow, setExtraTomorrow] = useState('');
  const [employeeId, setEmployeeId] = useState(null);
  const [reportExists, setReportExists] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEmployeeIdAndCheckReport = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStr);
        if (user?.id) {
          setEmployeeId(user.id);

          // 🔍 Now check if today's report exists for this customer
          const checkRes = await fetch(`http://192.168.43.175:3000/api/check-daily-report?customer_id=${customer.id}`);
          const checkData = await checkRes.json();
          if (checkData.success && checkData.exists) {
            setReportExists(true);
            setSubmitted(true);
          }
        } else {
          Alert.alert('Error', 'Employee ID not found in storage.');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch employee info or report.');
      }
    };
    fetchEmployeeIdAndCheckReport();
  }, []);

  const handleSubmit = async () => {
    if (!customer?.id || !employeeId) {
      Alert.alert('Missing Info', 'Customer or Employee ID missing');
      return;
    }

    try {
      const response = await fetch('http://192.168.43.175:3000/api/add-daily-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.id,
          got_cow_milk_today: gotTodayCow,
          got_buffalo_milk_today: gotTodayBuffalo,
          will_get_cow_milk_tomorrow: willGetTomorrowCow,
          will_get_buffalo_milk_tomorrow: willGetTomorrowBuffalo,
          extra_today: parseFloat(extraToday || 0),
          extra_tomorrow: parseFloat(extraTomorrow || 0),
          assigned_employee_id: employeeId,
          override: editMode, // if editing
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setReportExists(true);
        setEditMode(false);
        Alert.alert('Success', data.message);
      } else if (response.status === 409 && data.alreadySubmitted) {
        setReportExists(true);
        setSubmitted(true);
        Alert.alert('Already Submitted', 'Report already submitted. Tap edit to modify.');
      } else {
        Alert.alert('Error', data.message || 'Submission failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Network issue');
    }
  };

  return (
    <View style={styles.reportBox}>
      <Text style={styles.label}>Got milk today?</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={gotTodayCow} onValueChange={setGotTodayCow} />
        <Text style={styles.checkboxLabel}>Cow</Text>
        <Checkbox value={gotTodayBuffalo} onValueChange={setGotTodayBuffalo} style={{ marginLeft: 20 }} />
        <Text style={styles.checkboxLabel}>Buffalo</Text>
      </View>

      <TextInput
        placeholder="Extra milk today (L)"
        keyboardType="numeric"
        style={styles.input}
        value={extraToday}
        onChangeText={setExtraToday}
      />

      <Text style={styles.label}>Will get tomorrow?</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={willGetTomorrowCow} onValueChange={setWillGetTomorrowCow} />
        <Text style={styles.checkboxLabel}>Cow</Text>
        <Checkbox value={willGetTomorrowBuffalo} onValueChange={setWillGetTomorrowBuffalo} style={{ marginLeft: 20 }} />
        <Text style={styles.checkboxLabel}>Buffalo</Text>
      </View>

      <TextInput
        placeholder="Extra milk tomorrow (L)"
        keyboardType="numeric"
        style={styles.input}
        value={extraTomorrow}
        onChangeText={setExtraTomorrow}
      />

      {reportExists && (
        <Text style={styles.submittedNotice}>Report already submitted for today.</Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.submitBtn, reportExists && !editMode && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={reportExists && !editMode}
        >
          <Text style={styles.submitBtnText}>{editMode ? 'Update' : 'Submit'}</Text>
        </TouchableOpacity>

        {reportExists && !editMode && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {submitted && <Text style={styles.submittedText}>✔ Submitted</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  reportBox: { padding: 12, marginVertical: 10, backgroundColor: '#f1f5f9', borderRadius: 8 },
  label: { fontWeight: 'bold', marginTop: 10 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { marginLeft: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5, borderRadius: 6 },
  submitBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, marginTop: 10 },
  disabledBtn: { backgroundColor: '#a5b4fc' },
  submitBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  submittedText: { color: '#10b981', textAlign: 'center', marginTop: 10, fontWeight: '600' },
  submittedNotice: { color: '#16a34a', marginTop: 10, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBtn: { marginLeft: 10, backgroundColor: '#fbbf24', padding: 10, borderRadius: 8 },
  editBtnText: { color: '#000', fontWeight: 'bold' }
});

export default ReportSubmit;
