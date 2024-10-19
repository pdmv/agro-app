import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Color from '../themes/Color';

const InfoModal = ({ msg, visible, onPress, icon }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <Feather name={icon ? icon : "check-circle"} size={24} color={Color.darkestGray} />
          <Text style={{ color: Color.darkestGray, textAlign: 'center', marginTop: 10 }}>{`${msg}`}</Text>
          <TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
            <Text style={{ color: Color.darkestGray, fontWeight: 'bold' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: Color.white,
    minWidth: 200,
    maxWidth: '80%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default InfoModal;