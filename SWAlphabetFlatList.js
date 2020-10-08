import React, { Component } from 'react';
import { View, InteractionManager, Dimensions, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { SectionHeader } from './SectionHeader';
import { AlphabetListView } from './AlphabetListView';
import { SectionListItem } from './SectionListItem';
const screenHeight = Dimensions.get('window').height;

/**
 * See similar code in https://github.com/UseAllFive/react-native-alphabet-flat-list
 */
export class SWAlphabetFlatList extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    itemHeight: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired, // this.props.renderItem - DO NOT CONFUSE WITH this.renderItem!
    sectionHeaderHeight: PropTypes.number,
    sectionItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onSelect: PropTypes.func
  };

  static defaultProps = {
    sectionHeaderHeight: 25,
    sectionItemComponent: SectionListItem
  };

  componentDidMount() {
    this.refreshBaseData(this.props.data);
  }

  componentWillReceiveProps({ data }) {
    if (data !== this.props.data) {
      this.refreshBaseData(data);
    }
  }

  /**
   * @param data
   */
  refreshBaseData = data => {
    const titles = Object.keys(data);

    const offset = (index, itemLength) => index * this.props.sectionHeaderHeight + itemLength * this.props.itemHeight;

    const itemLayout = titles.map((title, index) => {
      const beforeItemLength = titles.slice(0, index).reduce((length, item) => length + data[item].length, 0);
      const itemLength = data[title].length;
      return {
        title,
        itemLength,
        beforeItemLength,
        length: this.props.sectionHeaderHeight + this.props.itemHeight * itemLength,
        offset: offset(index, beforeItemLength)
      };
    });

    // Calculate the number of first screen renderings to avoid blank areas
    let initialNumToRender = itemLayout.findIndex(item => item.offset >= this.state.containerHeight);
    if (initialNumToRender < 0) {
      initialNumToRender = titles.length;
    }

    this.setState({
      itemLayout,
      titles,
      selectAlphabet: titles[0],
      initialNumToRender
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
		console.warn("onSelect, index is " + index);
		console.warn("onSelect, dataSourceCoordinates " + JSON.stringify(this.state.dataSourceCoordinates));
    if (this.state.titles[index]) {
			let title = this.state.titles[index]; // e.g. "T"
      // const { length, offset } = this.getItemLayout(index);
			//this.list.scrollTo({ x: 0, y: offset, animated: false });
			let data = this.state.dataSourceCoordinates[title];
			let offset = data.y;
			console.warn("onSelect, this.state.titles[index] " + title + " " + offset);
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
   * 可视范围内元素变化时改变所选字母
   * @param viewableItems
   */
  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length) {
      // 点击字母触发的滚动3秒内不响应
      if (new Date().getTime() - this.touchedTime < 3000) {
        return;
      }

      this.setState({
        selectAlphabet: viewableItems[0].item
      });
    }
  };

  getItemLayout = (index) => {
	  console.warn("Hello, index = " + index + " dataSourceCoordinates = " + JSON.stringify(this.props.dataSourceCoordinates));
	  let x = "u";
	  return ({
    length: this.state.itemLayout[index].length,
    offset: this.state.itemLayout[index].offset,
    index
	})};
	
	handleSectionHeaderLayout = (data) => {
		console.warn("Hello handleSectionHeaderLayout App handles data from child: " + JSON.stringify(data));
		var obj = {};
	}

  /**
   * @param{String} item is the header for this section, like "A", "B", etc.
   */
  renderItem = item => {
		console.warn("Hello renderItem " + item);
    //const MSectionHeader = this.props.sectionHeaderComponent;
	
	// this.props.renderItem renders a View with the "item" text, the person's name in the Contact list or whatever.
	// this.props.renderItem is passed an Object that looks like this:
	// {"item":"Shlomo Eckstein","index":0,"sectionId":"E","last":false}
	// ..
	// {"item":"Vanessa Erogbogbo","index":5,"sectionId":"E","last":true}
	// ..
	// {"item":"Hello World","index":0,"sectionId":"H","last":true}
	// So, index starts at 0 for each **section**.
	var h = 25; 
	/*
	if (this.props.sectionHeaderHeight) {
		h = this.props.sectionHeaderHeight;
	}*/
	/*
    return (
      <View key={item}>
        <SectionHeader key={item} height={h} h={h} title={item} handleSectionHeaderLayout={this.handleSectionHeaderLayout}/>
        {this.props.data[item].map((itemValue, itemIndex, items) =>
          this.props.renderItem({
            item: itemValue,
            index: itemIndex,
            sectionId: item,
            last: itemIndex === items.length - 1
          })
        )}
      </View>
		);
		*/
		return (<KeyedView item={item}
				data={this.props.data}
				handleSectionHeaderLayout={this.handleSectionHeaderLayout}
				renderItem={this.props.renderItem}
				handleChildLayout={this.handleChildLayout}
		/>)
  };

	constructor(props) {
		super(props);
		//this.renderEach = this.renderEach.bind(this);
		this.state = {
			dataSourceCoordinates : {},
			itemLayout : [],
			titles : [],
			selectAlphabet: undefined,
			initialNumToRender : 0
		}
	}

	
	handleChildLayout = (data) => {
		// Input data like {"width":411.4285583496094,"height":225.14285278320312,"x":0,"y":225.14285278320312}
		console.warn("SW Hello handleChildLayout App handles data from child: " + JSON.stringify(data));
		var obj = {};
		obj[data.id] = data;
		console.warn("SW Hello handleChildLayout App handles data from child: " + JSON.stringify(obj));
		var newKey = "" + data.id;
		this.setState(prevState => {
			let z = { ...prevState.dataSourceCoordinates };
			console.warn("SW Hello prevState ZZZ! " + JSON.stringify(z));
			z[newKey] = data;
			console.warn("SW Hello new z! " + JSON.stringify(z));
			return {dataSourceCoordinates : z};
		});
		console.warn("*** SW Hello handleChildLayout App handles data from child: obj " + JSON.stringify(obj));
		this.setState(obj);
		console.warn("*** SW Hello handleChildLayout App handles data from child: this.state " + JSON.stringify(this.state.newKey));
		console.warn("SW Hello! handleChildLayout looks for renderEach " + (typeof this.renderEach));
	}

  render() {
	  console.warn("SWAlphabetFlatList.render: this.state.titles " + JSON.stringify(this.state.titles));
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
		console.warn("SW KeyedView constructor Hello this.props.item: " + JSON.stringify(this.props.item));
	}
	onLayout = (e) => {
		console.warn("Hello! KeyedView.onLayout XXXXXX?? " + JSON.stringify(e.nativeEvent.layout.y) + ", " + 
			JSON.stringify(e.nativeEvent.layout.y) + " sectionId? " + this.props.item);
		let obj = {
			id: this.props.item, // e.g. "T"
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
			x: e.nativeEvent.layout.x,
			y: e.nativeEvent.layout.y // layout position of this SectionHeader?
		}
		this.props.handleChildLayout(obj);
	}

	render () { 
		let h = 25;
		let item = this.props.item;
		let sectionId = item;
		// item is NOT {"item":{"name":"Alex Tabarrok","id":20},"index":0,"sectionId":"T","last":false}
		// item is "T" for example
		// data is {"A":[{"name":"Edith Abbott","id":1},
		//			{"name":"Kenneth Arrow","id":2}],
		//          "B":[{"name":"Robert Barro","id":3},...
		console.warn("Hello SW. KeyedView item : " + JSON.stringify(item));
		console.warn("Hello SW. KeyedView sectionId : " + JSON.stringify(sectionId));
		console.warn("Hello SW. KeyedView data : " + JSON.stringify(this.props.data));
		this.props.data[sectionId].map((itemValue, itemIndex, items) => console.warn(JSON.stringify(itemValue) + ", " + itemIndex + ", item " + item));
		return (<View key={item} onLayout={this.onLayout}>
		<SectionHeader key={item} height={h} h={h} title={item} handleSectionHeaderLayout={this.props.handleSectionHeaderLayout}/>
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
