import axios from 'axios';
import { elements, requests } from '../base';
import { renderSubArticles } from '../views/articleViews';
import { renderAlert } from './../views/viewsBase';

const {
  article,
  subArticle,
  articleInput,
  articleList,
  inputOptions,
  addArticleForm,
} = elements;

const { addArticleReq } = requests;

const getSubArticle = () => {
  const subArticleOptions = document.getElementById('subArticleOptions');
  return subArticleOptions.options[subArticleOptions.selectedIndex].text;
};

const getInput = () => {
  let subArticleSelected;

  //* Check if Article is selected
  const isArticle = isTypeSelected('article');
  if (isArticle) subArticleSelected = getSubArticle();

  return {
    list: articleList.options[articleList.selectedIndex].text,
    sublist: subArticleSelected,
    input: articleInput.value,
  };
};

const isTypeSelected = (type) => {
  //* Get selected type and compare it to Article
  const selectedType = articleList.options[articleList.selectedIndex].text;
  return selectedType === type;
};

const addArticleTypes = () => {
  //* Check if Article is selected
  const isArticle = isTypeSelected('article');

  //* If type is article, render the subtypes, else return
  if (isArticle) return renderSubArticles();

  //* Remove the subarticle element from html
  const subArticleDiv = document.getElementById('subArticleDiv');
  if (subArticleDiv) return subArticleDiv.remove();
};

const Article = {
  category: [],
};

const handleAddCategory = (input) => Article['category'].push(input.input);

const handleAddArticle = (userInput) => {
  //* Type: Object
  const { sublist, input } = userInput;

  const currentInput = {};
  currentInput[`${sublist}`] = input;
  return Article.article.push(currentInput);
};

const addInput = (input) => {
  //) Check if selected type is Article or Categories
  const isArticle = isTypeSelected('article');
  const isCategory = isTypeSelected('category');

  //) If article or category, then handle each one of them
  if (isArticle) return handleAddArticle(input);
  if (isCategory) return handleAddCategory(input);

  Article[input.list] = input.input;
};

const removeBox = () => {
  const alertBox = document.getElementById('alert');
  alertBox.style.display = 'none';
};

const addSubArticle = (e) => {
  //) Prevent reload
  e.preventDefault();

  //) Get article input and selected type
  const input = getInput();

  //) Add them to the Global article object
  addInput(input);

  //) Render success alert
  const message = 'Sub Article Added Successfully';
  renderAlert(addArticleForm, message, 'info');

  //) Wait 2 seconds, then remove it
  setTimeout(removeBox, 2000);
};

const sendArticle = async (input) => {
  try {
    const { title, cover, thumbnail, type, category, markdown } = input;
    console.log(input);

    const res = await axios.post(addArticleReq, {
      title,
      type,
      category,
      markdown,
      // cover,
      // thumbnail,
    });

    const message = 'Article Successfully Aded';
    renderAlert(addArticleForm, message, 'success');

    //) Wait 2 seconds, then remove it
    setTimeout(removeBox, 2000);
    console.log(res);
  } catch (error) {
    console.log(error);
    const message = 'Something went wrong, Please try again';
    renderAlert(addArticleForm, message, 'error');

    //) Wait 2 seconds, then remove it
    setTimeout(removeBox, 2000);
  }
};

const addArticle = async (e) => {
  //) Prevent reload
  e.preventDefault();

  //) Get the Article Object and Send it to the Database
  await sendArticle(Article);
};

export const articleController = () => {
  //) Event Listner to submit a sub Article
  subArticle.addEventListener('click', addSubArticle);

  //) Event listner to options, if Article is clicked, Add sub Articles
  inputOptions[0].addEventListener('change', addArticleTypes);

  //? Not yet developped
  article.addEventListener('click', addArticle);
};
