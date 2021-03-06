import React, { Component } from 'react';
import { View, InteractionManager, Dimensions, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { SectionHeader } from './SectionHeader';
import { AlphabetListView } from './AlphabetListView';
import { SectionListItem } from './SectionListItem';

/**
 * See similar code in https://github.com/UseAllFive/react-native-alphabet-flat-list
 */
export class SWAlphabetFlatList extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    renderItem: PropTypes.func.isRequired, // this.props.renderItem - DO NOT CONFUSE WITH this.renderItem!
    sectionItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onSelect: PropTypes.func
  };

  static defaultProps = {
		sectionItemComponent: SectionListItem,
		sectionHeaderComponent: SectionHeader
  };

  componentDidMount() {
    this.refreshBaseData(this.props.data);
  }

  /**
   * @param data
   */
  refreshBaseData = data => {
    const titles = Object.keys(data);

		this.setState({
      titles,
      selectAlphabet: titles[0]
    });
  };

  /**
   * Get the height of the list area, used to calculate the display of the letter list
   */
  onLayout = ({ nativeEvent: { layout } }) => {
    // Ensure that the position coordinates are obtained after the navigation animation is completed, otherwise it will be inaccurate
    InteractionManager.runAfterInteractions(() => {
      this.alphabet.measure((x, y, w, h, px, py) => {
        this.setState({
          pageY: py
        });
      });
    });
    this.setState({
      containerHeight: layout && layout.height
    });
  };

  /**
   * Tap the letter to trigger scroll
   */
	onSelect = index => {
		if (this.state.titles[index]) {
			let title = this.state.titles[index]; // e.g. "T"
			// No longer using getItemLayout; it assumed fixed height on each item
			// const { length, offset } = this.getItemLayout(index);
			// this.list.scrollTo({ x: 0, y: offset, animated: false });
			let data = this.state.dataSourceCoordinates[title];
			let offset = data.y;
			this.list.scrollTo({ x: 0, y: offset, animated: false });
			this.touchedTime = new Date().getTime();

			// Only emit when different index has been selected
			if (this.oldIndex !== index) {
				this.oldIndex = index;
				this.props.onSelect ? this.props.onSelect(index) : null;
				this.setState({
					selectAlphabet: this.state.titles[index]
				});
			}
		}
	};

  /**
   * Change the selected letter when the element in the visible range changes
   * @param viewableItems
   */
  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length) {
      // The scroll triggered by clicking the letter does not respond within 3 seconds
      if (new Date().getTime() - this.touchedTime < 3000) {
        return;
      }

      this.setState({
        selectAlphabet: viewableItems[0].item
      });
    }
  };

	handleSectionHeaderLayout = (data) => {
		// TODO anything?
	}

  /**
   * @param{String} item is the header for this section, like "A", "B", etc.
   */
	renderItem = item => {
		// this.props.data is something like {"A":[{"name":"Edith Abbott","id":1}, ...}
		return (<KeyedView key={item} item={item}
			sectionHeader={this.props.sectionHeaderComponent}
			data={this.props.data}
			handleSectionHeaderLayout={this.handleSectionHeaderLayout}
			renderItem={this.props.renderItem}
			handleChildLayout={this.handleChildLayout}
		/>);
	};

	constructor(props) {
		super(props);
		//this.renderEach = this.renderEach.bind(this);
		this.state = {
			dataSourceCoordinates : {},
			titles : [],
			selectAlphabet: undefined,
			initialNumToRender : 0
		}
	}
	
	/**
	 * Example of what input data may look like:
	 * {"id":"C","width":411.4285583496094,"height":204.57142639160156,"x":0,"y":274.8571472167969}
	 * @param {data} Object with an id property that is a letter, like "C", a height, width, x, and y value
	 */
	handleChildLayout = (data) => {
		// Input data like {"width":411.4285583496094,"height":225.14285278320312,"x":0,"y":225.14285278320312}
		var obj = {};
		obj[data.id] = data;
		var newKey = "" + data.id;
		this.setState(prevState => {
			let z = { ...prevState.dataSourceCoordinates };
			//console.warn("SW Hello prevState ZZZ! " + JSON.stringify(z));
			z[newKey] = data;
			//console.warn("SW Hello new z! " + JSON.stringify(z));
			return {dataSourceCoordinates : z};
		});
		//console.warn("*** SW Hello handleChildLayout App handles data from child: obj " + JSON.stringify(obj));
		//this.setState(obj);
		//console.warn("*** SW Hello handleChildLayout App handles data from child: this.state " + JSON.stringify(this.state.newKey));
		//console.warn("SW Hello! handleChildLayout looks for renderEach " + (typeof this.renderEach));
	}

  render() {
	  //console.warn("SWAlphabetFlatList.render: this.state.titles " + JSON.stringify(this.state.titles));
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1
        }}
        ref={ref => {
          this.container = ref;
        }}>
        <ScrollView
          ref={ref => {
            this.list = ref;
          }}
          {...this.props}>
          {this.props.renderHeader ? this.props.renderHeader() : null}
          {this.state.titles.map(item => this.renderItem(item))}
        </ScrollView>
        <AlphabetListView
          container={ref => (this.alphabet = ref)}
          pageY={this.state.pageY}
          onLayout={this.onLayout}
          contentHeight={this.state.containerHeight}
          item={this.props.sectionItemComponent}
          titles={this.state.titles}
          selectAlphabet={this.state.selectAlphabet}
          onSelect={this.onSelect}
        />
      </View>
    );
  }
}


/**
 * KeyedView is a View that has a unique id, it encloses each SectionHeader, and everything in the section under it.
 */
class KeyedView extends React.Component {
	constructor(props) {
		super(props);
		// this.props.item is expected to be a letter, like "T"
	}
	/**
	 * The onLayout method here is used to propagate properties, in particular y,
	 * to the container/parent, so scrolling to the section header can be done
	 * correctly.
	 */
	handleOnLayout = (e) => {
		let obj = {
			id: this.props.item, // e.g. "T"
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
			x: e.nativeEvent.layout.x,
			y: e.nativeEvent.layout.y // layout position of this SectionHeader. Hopefully! e.g. 160.57142639160156,
		}
		this.props.handleChildLayout(obj);
	}

	render () { 
		// TODO FIXME height is artificially set to 25.
		let h = 25;
		let item = this.props.item;
		let sectionId = item; // e.g. "T"
		const MSectionHeader = this.props.sectionHeader;
		// TODO FIXME
		// Getting an ERROR message "Warning: Each child in a list should have a unique "key" prop."
		// these do not help:
		//let viewKey = "swView" + item;
		//let sectionHeaderKey = "swSectionHeader" + item;
		// item is NOT {"item":{"name":"Alex Tabarrok","id":20},"index":0,"sectionId":"T","last":false}
		// item is "T" for example
		// data is {"A":[{"name":"Edith Abbott","id":1},
		//			{"name":"Kenneth Arrow","id":2}],
		//          "B":[{"name":"Robert Barro","id":3},...
		// Useful for debugging:
		// this.props.data[sectionId].map((itemValue, itemIndex, items) => console.warn(JSON.stringify(itemValue) + ", " + itemIndex + ", item " + item));
		return (<View onLayout={this.handleOnLayout}>
		<MSectionHeader height={h} h={h} title={item} handleSectionHeaderLayout={this.props.handleSectionHeaderLayout}/>
		{this.props.data[sectionId].map((itemValue, itemIndex, items) =>
			this.props.renderItem({
				item: itemValue,
				index: itemIndex,
				sectionId: item,
				last: itemIndex === items.length - 1
			})
		)}
		</View>);
	}
};
