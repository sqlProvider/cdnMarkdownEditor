var cdnEditor = function(elem){
    var _this = this;
    var e = $('#' + elem);
    e.addClass('cdnEditor');

    // Creating Editor Form
    e.append(
        '<div layout="row" class="toolsBar">' +
        '<div data-elemType="bold" class="tool"><i class="fa fa-bold"></i></div>' +
        '<div data-elemType="italic" class="tool"><i class="fa fa-italic"></i></div>' +
        '<div class="divider">&nbsp;</div>' +
        '<div data-elemType="link" class="tool"><i class="fa fa-link"></i></div>' +
        '<div data-elemType="blockquote" class="tool"><i class="fa fa-indent"></i></div>' +
        '<div data-elemType="code" class="tool"><i class="fa fa-code"></i></div>' +
        '<div data-elemType="image" class="tool"><i class="fa fa-picture-o"></i></div>' +
        '<div class="divider">&nbsp;</div>' +
        '<div data-elemType="heading1" class="tool"><i class="fa fa-header"></i>1</div>' +
        '<div data-elemType="heading2" class="tool"><i class="fa fa-header"></i>2</div>' +
        '<div data-elemType="heading3" class="tool"><i class="fa fa-header"></i>3</div>' +
        '<div data-elemType="heading4" class="tool"><i class="fa fa-header"></i>4</div>' +
        '<div data-elemType="heading5" class="tool"><i class="fa fa-header"></i>5</div>' +
        '<div data-elemType="heading6" class="tool"><i class="fa fa-header"></i>6</div>' +
        '<div data-elemType="UnOrderedList" class="tool"><i class="fa fa-list-ul"></i></div>' +
        '<div data-elemType="ellipsis" class="tool"><i class="fa fa-ellipsis-h"></i></div>' +
        '</div>' +
        '<textarea id="textarea' + elem + '" name="' + elem + '" rows="20"></textarea>'
    );

    // Defination editor.
    var editor = document.getElementById('textarea' + elem);

    e.children('.toolsBar').on( "click", ".tool", function() {
        _this.toolHandler($(this).attr('data-elemType'));

    });
    e.on('keydown', function(key){
        if(key.which == 9){ // Tab Key : 9;
            /*
             * Press tab then editor lost focus,
             * So return preventDefault() and tab adding manual to editor.
             * */
            var editorValue = _this.getEditorStatue();
            key.preventDefault();
            // (\t).length is 1. So selection is increase 1
            var s = editor.selectionStart + 1;
            var f = editor.selectionEnd - editor.selectionStart;
            f = f < 0 ? f * -1 : f;
            editor.value =  editorValue.beforeSelection +
                '\t' +
                editorValue.selection +
                editorValue.afterSelection;
            editor.selectionStart = s;
            editor.selectionEnd = s + f;
        }
        else if(key.which == 13){ // Enter Key : 13;
            /*
             * Press enter in list or blockquote line or tabbed line
             * new line start list, blockquote, tabbed or allofthem.
             * */
            var editorValue = _this.getEditorStatue();
            var beforeCaret = '';
            var position = editorValue.beforeSelection.length - 1;
            var lineBreak = true;
            //Caret position is 0 then break while
            if(editorValue.value.trim() == '' || editorValue.beforeSelection[position] == '\n')
                lineBreak = false;
            while(lineBreak) {
                // [\t, *, >] characters are transfer to new line
                if(
                    editorValue.beforeSelection[position] == '\t' ||
                    editorValue.beforeSelection[position] == '*' ||
                    editorValue.beforeSelection[position] == '>' ||
                    editorValue.beforeSelection[position] == '<'
                )
                    beforeCaret = editorValue.beforeSelection[position] + beforeCaret;
                position--;
                // Line end and break while
                if(editorValue.beforeSelection[position] == '\n' || position < 0)
                    lineBreak = false;
            }
            key.preventDefault();

            // If * more then one remove it
            if(/[\*]{2,}/g.test(beforeCaret))
                beforeCaret = beforeCaret.replace(/\*/g,'');
            // If > more then one remove it
            if(/[\>]{2,}/g.test(beforeCaret))
                beforeCaret = beforeCaret.replace(/\>/g,'');
            if(/[\<]+[\s\S]{0,}[\>]+/g.test(beforeCaret)){
                beforeCaret = beforeCaret.replace(/\>/g,'');
                beforeCaret = beforeCaret.replace(/\</g,'');
            }else{
                beforeCaret = beforeCaret.replace(/\</g,'');
            }

            // if beforeCaret is not empty adding space before editor caret.
            if(beforeCaret.trim().length > 0)
                beforeCaret += ' ';

            // Setting caret position and update editor value;
            var s = (editorValue.beforeSelection + editorValue.selection + beforeCaret).length + 1;
            editor.value =  editorValue.beforeSelection +
                '\n' +
                beforeCaret +
                editorValue.afterSelection;
            editor.selectionStart = editor.selectionEnd= s;
        }
    });

    this.toolHandler = function(elemType){
        /*
         * Run before click editor button
         * */
        var editorValue = this.getEditorStatue();
        var s = editor.selectionStart;
        var f = editor.selectionEnd - editor.selectionStart;

        // If Selected text is equals space then selectedText replace to tools default text
        if(editorValue.selection == '')
            editorValue.selection = tools[elemType].defaultText;

        // If tools default text is equals space then selected text not come between before and after text
        if(tools[elemType].defaultText == ''){
            editorValue.beforeSelection += editorValue.selection;
            editorValue.selection = '';
        }

        // Adding to editor
        editor.value =  editorValue.beforeSelection +
            tools[elemType].general +
            tools[elemType].beforeText +
            editorValue.selection +
            tools[elemType].afterText +
            tools[elemType].general +
            editorValue.afterSelection;

        // Select text then adding
        s += (tools[elemType].general + tools[elemType].beforeText).length;
        editor.selectionStart = s;
        editor.selectionEnd = s + editorValue.selection.length;
        // The editor will lost focus then click tools bar. And focus back.
        editor.focus();
    };

    /*
     * Editor Buttons Settings
     * */
    var tools = {
        // Inline Element
        bold : {
            beforeText : '**',
            afterText  : '**',
            general    : ' ',
            defaultText: lang[language].bold
        },
        italic : {
            beforeText : '*',
            afterText  : '*',
            general    : ' ',
            defaultText: lang[language].italic
        },
        link : {
            beforeText : '[',
            afterText  : '](url)',
            general    : ' ',
            defaultText: lang[language].link
        },

        // Heading
        heading1 : {
            beforeText : '#',
            afterText  : '#',
            general    : '\n',
            defaultText: lang[language].heading1
        },
        heading2 : {
            beforeText : '##',
            afterText  : '##',
            general    : '\n',
            defaultText: lang[language].heading2
        },
        heading3 : {
            beforeText : '###',
            afterText  : '###',
            general    : '\n',
            defaultText: lang[language].heading3
        },
        heading4 : {
            beforeText : '####',
            afterText  : '####',
            general    : '\n',
            defaultText: lang[language].heading4
        },
        heading5 : {
            beforeText : '#####',
            afterText  : '#####',
            general    : '\n',
            defaultText: lang[language].heading5
        },
        heading6 : {
            beforeText : '######',
            afterText  : '######',
            general    : '\n',
            defaultText: lang[language].heading6
        },

        // Blockquotes
        blockquote : {
            beforeText : '> ',
            afterText  : '',
            general    : '\n',
            defaultText: lang[language].blockquote
        },

        // Lists
        UnOrderedList : {
            beforeText : '* ',
            afterText  : '',
            general    : '\n',
            defaultText: ' ' + lang[language].unOrderedList
        },

        // Code
        code :{
            beforeText : '```[language]\n',
            afterText  : '\n```',
            general    : '',
            defaultText: '\t' + lang[language].code
        },

        // Ellipsis
        ellipsis : {
            beforeText : '----------',
            afterText  : '',
            general    : '\n',
            defaultText: ''
        },

        // Image
        image : {
            beforeText : '![',
            afterText  : '](url)',
            general    : '\n',
            defaultText: lang[language].image
        }
    };

    this.getEditorStatue = function(){
        /*
         * Return Editor statue at the moment
         * */
        return {
            value : editor.value,
            beforeSelection : editor.value.substring(0, editor.selectionStart),
            selection       : editor.value.substring(editor.selectionStart, editor.selectionEnd),
            afterSelection  : editor.value.substring(editor.selectionEnd)
        }
    };
};