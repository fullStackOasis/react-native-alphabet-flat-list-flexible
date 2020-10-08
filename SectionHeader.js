import { Text, View } from 'react-native';
import React from 'react';

/**
 * Each SectionHeader must know its y position and its index.
 * These are passed down as props.
 */
export class SectionHeader extends React.Component {
	constructor(props) {
    super(props);
	}
	
	onLayout = (e) => {
		let x = e.nativeEvent.layout.x;
		let y = e.nativeEvent.layout.y;
		console.warn("Hello! SectionHeader.onLayout print style, id, imdex " + 
			JSON.stringify(this.props.style) + ", " + JSON.stringify(this.props.id) +
			JSON.stringify(this.props.index) + ", " + JSON.stringify(this.props.title) +
			JSON.stringify(x) + ", " + JSON.stringify(y));
		this.props.handleSectionHeaderLayout({
			title: this.props.title,
			index: this.props.index,
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
			x: e.nativeEvent.layout.x,
			y: e.nativeEvent.layout.y
		});
	}

  render() {
		let h = this.props.h;
		let title = this.props.title;
		console.warn("SectionHeader.render");
		return (
    <View
      style={{
        height: 25,
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        paddingLeft: 15
			}}
			onLayout={this.onLayout}
    >
			<Text
				style={{
					color: '#888',
					fontSize: 14
				}}
			>
        {title}
      </Text>
    </View>
  );
	};
}
