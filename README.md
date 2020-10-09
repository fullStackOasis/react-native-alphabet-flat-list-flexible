# A Flexible Alphabet Flat List

![scroll to item](https://github.com/fullStackOasis/react-native-alphabet-flat-list-flexible/raw/master/images/react-native-alphabet-flat-list-flexible-demo.gif | width=100)
Click a letter in the vertical alphabet list, and you're taken to that section of the item list.

This Alphabet Flat List works even when the items in the list have different sizes. It saves all the heights of each item in the list during layout, and uses that information to compute the number to scroll to. [Article about this technique](https://aboutreact.com/scroll_to_a_specific_item_in_scrollview_list_view/).

## Installation

- Using [npm](https://www.npmjs.com/#getting-started): `npm install fullStackOasis/react-native-alphabet-flat-list-flexible --save`
- Using [Yarn](https://yarnpkg.com/): `yarn add fullStackOasis/react-native-alphabet-flat-list-flexible`

## Example

The [demo project that was used to create the gif above is found at github](https://github.com/fullStackOasis/react-native-alphabet-flat-list-flexible-demo), too.

## Props
- **`data`**_(Object)_ [isRequire] - listData to display
- **`renderItem`**_(Function)_ [isRequire] - itemComponent render
- **`sectionHeaderComponent`**_(Component)_ - sectionHeader


## License

- [MIT](LICENSE)
