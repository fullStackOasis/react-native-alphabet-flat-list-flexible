/**
 * Sample React Native App demos react-native-alphabet-flat-list-flexible SWAlphabetFlatList component.
 * React Native - https://github.com/facebook/react-native
 * SWAlphabetFlatList - thank you to https://github.com/UseAllFive/react-native-alphabet-flat-list
 * and https://github.com/yoonzm/react-native-alphabet-flat-list
 * Helpful post:
 * https://aboutreact.com/scroll_to_a_specific_item_in_scrollview_list_view/
 * 
 * @format
 * @flow strict-local
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import SWAlphabetFlatList from 'react-native-alphabet-flat-list-flexible';

// Demo list of items.
const CONTACTS = {
	A: [{name:'Edith Abbott', id:1}, {name:'Kenneth Arrow',id:2,desc:"a major figure in post-World War II neo-classical economic theory"}],
	B: [{name:'Robert Barro', id:3}, {name:'Walter Block', id:4} ],
	C: [{name:'John Elliot Cairnes', id:5, desc: "often described as the \"last of the classical economists\""}, {name:'Gustav Cassel', id:6}, {name:'Jean-Baptiste Colbert', id:7}],
	D: [{name:'Stephen J. Dubner', id:8}, {name:'J. Bradford DeLong', id:9, desc: "Deputy Assistant Secretary of the U.S. Department of the Treasury in the Clinton Administration under Lawrence Summers"}],
	E: [{name:'Shlomo Eckstein', id:10}, {name:'Francis Ysidro Edgeworth', id:11}, {name:'Sebastian Edwards', id:12}, {name:'Martin Eichenbaum', id:13}, {name:'Ernst Engel', id:14}, {name:'Vanessa Erogbogbo', id:15}],
	H: [{name:'Trygve Haavelmo', id:16}],
	M: [{name:'Mark J. Machina', id:17}, {name:'Karl Marx', id:18}, {name:'Alva Myrdal', id:19}],
	T: [{name:'Alex Tabarrok', id:20}, {name:'Nassim Taleb', id:21, desc: "essayist, scholar, mathematical statistician, and former option trader and risk analyst"}, {name:'Richard Thaler', id:22, desc : "theorist in behavioral economics"}, {name:'William Thompson', id:23},
	{name:'Catherine Tucker', id:24, desc : "known for research into the consequences of digital data for privacy, algorithmic bias, digital health and online advertising"}]
};
/* short for testing!
const CONTACTS = {
	A: [{name:'AAA', id:1}, {name:'AAAAA',id:2}],
	B: [{name:'B', id:3}, {name:'BBBB', id:4} ]
};
*/
const ITEM_HEIGHT = 100;
const SECTION_HEADER_HEIGHT = 30;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.renderEach = this.renderEach.bind(this);
		this.state = {
			dataSourceCoordinates : {}
		}
	}

	handleChildLayout = (data) => {
		var obj = {};
		obj[data.id] = data;
		var newKey = "" + data.id;
		this.setState(prevState => {
			let z = { ...prevState.dataSourceCoordinates };
			z[newKey] = data;
			return {dataSourceCoordinates : z};
		});
	}
	
	/**
	 * Returns a View with the item text.
	 * @param {Object} is for example {"item":"Test1","index":0,"sectionId":"T","last":false}
	 */
	renderEach(obj) {
		// Expected Object input to look something like this:
		// {"item":{"name":"Richard Thaler","id":22},"index":2,"sectionId":"T","last":false}
		return <KeyedView key={obj.item.id}
			id={obj.item.id}
			name={obj.item.name}
			handleChildLayout={this.handleChildLayout}
			desc={obj.item.desc}/>
	}

	render() { return (
		<SWAlphabetFlatList
			data={CONTACTS}
			renderItem={this.renderEach}
			itemHeight={ITEM_HEIGHT}
			sectionHeaderHeight={SECTION_HEADER_HEIGHT}
			dataSourceCoordinates={this.state.dataSourceCoordinates}
		/>);
	}
};

/**
 * KeyedView is a View that has a unique id.
 */
class KeyedView extends React.Component {
	constructor(props) {
		super(props);
	}
	handleOnLayout = (e) => {
		this.props.handleChildLayout({
			id: this.props.id,
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
			x: e.nativeEvent.layout.x,
			y: e.nativeEvent.layout.y
		});
	}

	render () { return (<View key={this.props.key} onLayout={this.handleOnLayout} style={this.props.style}>
	<Text style={styles.item}>{this.props.name}</Text>
	{this.props.desc &&
	<Text style={styles.item}>{this.props.desc}</Text>
	}
	</View>);
	}

};

const styles = StyleSheet.create({
	item: {
	  paddingHorizontal: 10,
	  paddingVertical: 10
	},
	header: {
	  fontSize: 12,
	  fontFamily: 'Cochin'
	}
  });
  
export default App;
