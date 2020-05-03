import { GET_AUTH_USER, LOGOUT, ERROR } from "./types";
import db from "../../config/fbConfig";
let unsubscribe;

export const login = user => async dispatch => {
  await db
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      return db
        .firestore()
        .collection("users")
        .doc(res.user.uid)
        .get()
        .then(user => {
          dispatch({
            type: GET_AUTH_USER,
            payload: user.data()
          });
        });
      dispatch({
        type: ERROR,
        payload: null
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: ERROR,
        payload: err.message
      });
    });
};

export const createUser = user => async dispatch => {
  // async magic goes here...
  if (user.file === "") {
    console.error(`not an image, the image file is a ${typeof user.file}`);
  }
  console.log(user);

  const uploadTask = db
    .storage()
    .ref(`/images/${user.file.name}`)
    .put(user.file);
  //initiates the firebase side uploading
  await uploadTask.on(
    "state_changed",
    snapShot => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot);
    },
    err => {
      //catches the errors
      console.log(err);
    },
    () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      db.storage()
        .ref("images")
        .child(user.file.name)
        .getDownloadURL()
        .then(async fireBaseUrl => {
          //setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))

          await db
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
              dispatch({
                type: ERROR,
                payload: null
              });
              return db
                .firestore()
                .collection("users")
                .doc(res.user.uid)
                .set({
                  id: res.user.uid,
                  username: user.username,
                  email: user.email,
                  profileImage: fireBaseUrl,
                  team: user.team,
                  league: user.league,
                  likes: []
                });
            })
            .catch(err => {
              console.log(err);
            });
        });
    }
  );

  dispatch(login(user));
};

export const getAuthUser = () => async dispatch => {
  console.log("in");

  await db
    .auth()

    .onAuthStateChanged(async user => {
      if (user) {
        // User is signed in.

        unsubscribe = await db
          .firestore()
          .collection("users")
          .doc(user.uid)
          .onSnapshot(
            {
              // Listen for document metadata changes
              includeMetadataChanges: true
            },
            doc => {
              dispatch({
                type: GET_AUTH_USER,
                payload: doc.data()
              });
            }
          );
      } else {
        // No user is signed in.
        console.log("MAL");
      }
    });
};

export const logOut = () => dispatch => {
  db.auth()
    .signOut()
    .then(() => {
      unsubscribe();
      dispatch({
        type: LOGOUT
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getError = msg => dispatch => {
  dispatch({
    type: ERROR,
    payload: msg
  });
};
