import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Button
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";

// * Map to Props * //

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

// * Render Comments Component * //

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }} alignItems="flex-start">
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating readonly startingValue={item.rating} imageSize={16} />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };
  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

// * Render Dish Component * //

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already favorite") : props.onPress()
            }
          />
          <Icon
            reverse
            name={"pencil"}
            type="font-awesome"
            color={"#512DA8"}
            style={styles.cardItem}
            onPress={() => props.onShowModal()}
          />
        </View>
      </Card>
    );
  } else {
    return <View></View>;
  }
}

// * Dish Detail Component * //

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      showModal: false,
      rating: 5,
      author: "",
      comment: ""
    };
  }

  static navigationOptions = {
    title: "Dish Details"
  };

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      comment: ""
    });
  }

  handleComment(dishId) {
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    this.toggleModal();
  }

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");

    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
          onPress={() => this.toggleModal()}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              onFinishRating={rating => this.setState({ rating: rating })}
            />
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user" }}
              leftIconContainerStyle={{ marginRight: 10 }}
              onChangeText={author => this.setState({ author: author })}
            />
            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment" }}
              leftIconContainerStyle={{ marginRight: 10 }}
              onChangeText={comment => this.setState({ comment: comment })}
            />
            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.handleComment(dishId);
                  this.resetForm();
                }}
                color="#5128AD"
                title="Submit"
              />
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="grey"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

// * Stylesheet * //

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  cardItem: {
    flex: 1,
    margin: 10
  },
  modal: {
    justifyContent: "center",
    margin: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
