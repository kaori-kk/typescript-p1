//Project state management

class projectState {
  private projects: any[] = [];
  addProjects(title: string, description: string, numOfPeople: number){
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople
    };
    this.projects.push(newProject)
  }
}
//validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable){
  let isValid = true;
  if (validatableInput.required){
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (validatableInput.minlength != null && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length > validatableInput.minlength;
  }
  if (validatableInput.maxlength != null && typeof validatableInput.value === "string"){
    isValid = isValid && validatableInput.value.length > validatableInput.maxlength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === "number"){
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === "number"){
    isValid = isValid && validatableInput.value > validatableInput.max;
  }
  return isValid;
}

//autobind funcion
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
){
  const original = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get(){
      const boundFn = original.bind(this)
      return boundFn;
    }
  }
  return adjDescriptor;
}

//project class list
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished"){
    this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`
    this.attach();
    this.renderContent();
  }

  private renderContent(){
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  private attach(){
    this.hostElement.insertAdjacentElement("beforeend", this.element)
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor(){
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input"

  this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
  this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
  this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement

  this.configure();
  this.attach();
  }

  private clearInput(){
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value
    
    const titleValidation: Validatable = {
      value: enteredTitle,
      required: true
    }
    const descriptionValidation: Validatable = {
      value: enteredDescription,
      required: true,
      minlength: 5
    }
    const peopleValidation: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5 
    }
    if(
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(peopleValidation)
    ){
      alert("Invalid input. Please fill all the form.")
      return;
    }else{
      return [enteredTitle, enteredDescription, parseFloat(enteredPeople)]
    }
  }

  @autobind
  private submitHandler(event: Event){
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)){
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people)
      this.clearInput();
    }
  }
  private configure(){
    this.element.addEventListener("submit", this.submitHandler)
  }

  private attach(){
    this.hostElement.insertAdjacentElement("afterbegin", this.element)
  }
}

const prjName = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
