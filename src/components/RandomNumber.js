import React from 'react';

import {Text, TouchableOpacity, StyleSheet} from 'react-native';

class Game extends React.Component {
    
    handlePress = () => {
        if (this.props.isDisabled) {return;}
        this.props.onPress(this.props.id); 
    };

    render() {
        return (
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={[styles.num, this.props.isDisabled && styles.disabled]}> {this.props.number} </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    num: {
        backgroundColor: '#ffe3ab',
        width: 100,
        marginVertical: 20,
        marginHorizontal: 30,
        textAlign: 'center',
        fontSize: 35,
    },
    disabled: {
        opacity: 0.3
    }
})

export default Game;