$(document).ready(function() {
    $('#createQuestForm').hide();
})

function toggleQuestForm() {
    $('#createQuestForm').toggle();
}

function generateJSONFile() {
  let json = {
    "name": "",
    "quest": {
      "questName": "",
      "questConditions": [],
      "reward": {
        "rewardConditions": [],
        "rewardDialogue": "",
        "itemID": 0, 
        "garyPower": 0,
        "preventFutureReward": "" // can be any name to be checked against to see if user should get reward
      },
      "questDialogue": ""
    },

    "dialogue": "", // normal dialogue if no quest is available
    "spriteID": undefined,
    "placement": {
      "screenID": undefined,
      "coordsOnScreen": [
        undefined,
        undefined
      ]
    }
  }

  json.name = $('#name').val();
  json.quest.questName = $('#questName').val();
  json.quest.questDialogue = $('#questDialogue').val();
  json.quest.reward.rewardDialogue = $('#rewardDialogue').val();
  json.quest.reward.preventFutureReward = $('#preventFutureReward').val();


  // conditions
  let rawQuestConditions = $('#questConditions').val();
  let questConditionsInArray = rawQuestConditions.split(",");
  let trimmedQuestConditions = questConditionsInArray.map((condition) => condition.trim());
  json.quest.questConditions = trimmedQuestConditions;

  let rawRewardConditions = $('#rewardConditions').val();
  let rewardConditionsInArray = rawRewardConditions.split(",");
  let trimmedRewardConditions = rewardConditionsInArray.map((condition) => condition.trim());
  json.quest.reward.rewardConditions = trimmedRewardConditions;

  // rewards
  if ($('#createQuestCheckbox').is(':checked')) {
    json.quest.reward.itemID = parseInt($('#itemID').val());
    json.quest.reward.garyPower = parseInt($('#GPAmount').val());
  }

  // other stuff
  json.dialogue = $('#dialogue_message').val();
  json.spriteID = parseInt($('#spriteID').val());
  json.placement.screenID = parseInt($('#screenID').val());
  let coordsOnScreenX = $('#coordsOnScreenX').val();
  let coordsOnScreenY = $('#coordsOnScreenY').val();

  // turn both coords into ints
  json.placement.coordsOnScreen = [coordsOnScreenX, coordsOnScreenY].map((coord) => parseInt(coord));

  download(json.name + ".json", JSON.stringify(json));
}

function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function uploadJSON(file) {
  let reader = new FileReader();   
  reader.readAsText(file[0]); 

  reader.onload = function(event) {
    let parsedJSON = JSON.parse(event.target.result); 
    console.log(parsedJSON)
    fillTextFields(parsedJSON);
  }
}

// why I don't like doing a lot of front-end stuff 
function fillTextFields(json) { 
  $('#name').val(json.name);

  // if the file contains a quest, check the checkbox and fill in info
  if (json.quest.questName.length > 0) {
    $('#createQuestCheckbox').prop('checked', true);
    toggleQuestForm();

    $('#questName').val(json.quest.questName);
    $('#questDialogue').val(json.quest.questDialogue);
    $('#rewardDialogue').val(json.quest.reward.rewardDialogue);
    $('#preventFutureReward').val(json.quest.reward.preventFutureReward);

    let rewardConditions = json.quest.reward.rewardConditions;
    if (rewardConditions.length > 0) $('#rewardConditions').val(rewardConditions.join(", "));
    
    let questConditions = json.quest.questConditions;
    if (questConditions.length > 0) $('#questConditions').val(questConditions.join(", "));

    $('#GPAmount').val(json.quest.reward.garyPower);
    $('#itemID').val(json.quest.reward.itemID);
  }

  // everything else should be true for all NPCs
  $('#dialogue_message').val(json.dialogue);
  $('#spriteID').val(json.spriteID);
  $('#screenID').val(json.placement.screenID);
  $('#coordsOnScreenX').val(json.placement.coordsOnScreen[0]);
  $('#coordsOnScreenY').val(json.placement.coordsOnScreen[1]);
}













