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
    
    if(
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0 
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
      console.log(title, description, people)
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