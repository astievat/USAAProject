# -*- coding: utf-8 -*-
"""
Created on Wed Mar 20 16:09:18 2019

@author: Freddy
"""
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
import yaml
import MySQLdb 
import mysql.connector
from textblob import TextBlob
global positiveCount
positiveCount = 0
global negativeCount
negativeCount = 0
global actionableCount
actionableCount = 0


class Splitter(object):
    def __init__(self):
        self.nltk_splitter = nltk.data.load('tokenizers/punkt/english.pickle')
        self.nltk_tokenizer = nltk.tokenize.TreebankWordTokenizer()
    def split(self, text):
        """
        input format: a paragraph of text
        output format: a list of lists of words.
            e.g.: [['this', 'is', 'a', 'sentence'], ['this', 'is', 'another', 'one']]
        """
        sentences = self.nltk_splitter.tokenize(text)
        tokenized_sentences = [self.nltk_tokenizer.tokenize(sent) for sent in sentences]
        return tokenized_sentences
    
class POSTagger(object):
    def __init__(self):
        pass

    def pos_tag(self, sentences):
        """
        input format: list of lists of words
            e.g.: [['this', 'is', 'a', 'sentence'], ['this', 'is', 'another', 'one']]
        output format: list of lists of tagged tokens. Each tagged tokens has a
        form, a lemma, and a list of tags
            e.g: [[('this', 'this', ['DT']), ('is', 'be', ['VB']), ('a', 'a', ['DT']), ('sentence', 'sentence', ['NN'])],
                    [('this', 'this', ['DT']), ('is', 'be', ['VB']), ('another', 'another', ['DT']), ('one', 'one', ['CARD'])]]
        """
        pos = [nltk.pos_tag(sentence) for sentence in sentences]
        #adapt format
        pos = [[(word, word, [postag]) for (word, postag) in sentence] for sentence in pos]
        return pos



class DictionaryTagger(object):

    
    
    def __init__(self, dictionary_paths):
        files = [open(path, 'r', encoding='utf-8', errors='ignore') for path in dictionary_paths]
        dictionaries = [yaml.load(dict_file) for dict_file in files]
        map(lambda x: x.close(), files)
        self.dictionary = {}
        self.max_key_size = 0
        for curr_dict in dictionaries:
            for key in curr_dict:
                #print (key)
                if key in self.dictionary:
                    self.dictionary[key].extend(curr_dict[key])
                else:
                    self.dictionary[key] = curr_dict[key]
                    self.max_key_size = max(self.max_key_size, len(str(key)))

    def tag(self, postagged_sentences):
        return [self.tag_sentence(sentence) for sentence in postagged_sentences]

    def tag_sentence(self, sentence, tag_with_lemmas=False):
        """
        the result is only one tagging of all the possible ones.
        The resulting tagging is determined by these two priority rules:
            - longest matches have higher priority
            - search is made from left to right
        """
        tag_sentence = []
        N = len(sentence)
        if self.max_key_size == 0:
            self.max_key_size = N
        i = 0
        while (i < N):
            j = min(i + self.max_key_size, N) #avoid overflow
            tagged = False
            while (j > i):
                expression_form = ' '.join([word[0] for word in sentence[i:j]]).lower()
                expression_lemma = ' '.join([word[1] for word in sentence[i:j]]).lower()
                if tag_with_lemmas:
                    literal = expression_lemma
                else:
                    literal = expression_form
                if literal in self.dictionary:
                    #self.logger.debug("found: %s" % literal)
                    is_single_token = j - i == 1
                    original_position = i
                    i = j
                    taggings = [tag for tag in self.dictionary[literal]]
                    tagged_expression = (expression_form, expression_lemma, taggings)
                    if is_single_token: #if the tagged literal is a single token, conserve its previous taggings:
                        original_token_tagging = sentence[original_position][2]
                        tagged_expression[2].extend(original_token_tagging)
                    tag_sentence.append(tagged_expression)
                    tagged = True
                else:
                    j = j - 1
            if not tagged:
                tag_sentence.append(sentence[i])
                i += 1
        return tag_sentence    
    
def value_of(sentiment):

    if sentiment == 'positive': 
        global positiveCount
        positiveCount= positiveCount + 1
        return 1

    if sentiment == 'negative':
        global negativeCount
        negativeCount = negativeCount + 1
        return -1
    return 0


def value_of_action(action):
    if action == 'action': 
        global actionableCount
        actionableCount = actionableCount + 1
        return 1
    return 0
#def sentiment_score(review):    
 #   return sum ([value_of(tag) for sentence in dict_tagged_sentences for token in sentence for tag in token[2]])

def sentence_score(sentence_tokens, previous_token, acum_score):    
    if not sentence_tokens:
        return acum_score
    else:
        current_token = sentence_tokens[0]
        tags = current_token[2]
        token_score = sum([value_of(tag) for tag in tags])
        if previous_token is not None:
            previous_tags = previous_token[2]
            if 'inc' in previous_tags:
                token_score *= 2.0
            elif 'dec' in previous_tags:
                token_score /= 2.0                
            elif 'inv' in previous_tags:
                token_score *= -1.0
        return sentence_score(sentence_tokens[1:], current_token, acum_score + token_score)

def sentiment_score(review):

    return sum([sentence_score(sentence, None, 0.0) for sentence in review])

def action_score(review):
    
    return sum ([value_of_action(tag) for sentence in dict_tagged_sentences for token in sentence for tag in token[2]])

    
    
#connection string and cursor

conn=mysql.connector.connect(host='107.180.1.16',user='teambyteme',passwd='!!Cis440',db='teambyteme') 
mycursor=conn.cursor()




#pull from reviews1
stoplist = stopwords.words('english')
SQLCommand=("Select * from reviews")
mycursor = conn.cursor()
mycursor.execute(SQLCommand)
records = mycursor.fetchall()
print("Rows:",mycursor.rowcount)
i=0
for row in records:
    positiveCount = 0
    negativeCount = 0
    actionableCount = 0
    idVar = row[0]
    reviewVar = row[1]
    qTypeVar = row[2]
        
    
    #get rid of stopwords
    noStopwordsReviewVar = [word for word in reviewVar.split() if word not in stoplist]
    #print (noStopwordsReviewVar)
    s = " ";
    noStopwordsReviewVar = s.join(noStopwordsReviewVar)
    print (noStopwordsReviewVar)
    #analysis
    text = reviewVar
    splitter = Splitter()
    postagger = POSTagger()
    splitted_sentences = splitter.split(text)
    #print (splitted_sentences)
    pos_tagged_sentences = postagger.pos_tag(splitted_sentences)
    #print (pos_tagged_sentences)
    dicttagger = DictionaryTagger([ 'dicts/positive.yml', 'dicts/negative.yml', 'dicts/action.yml', 'dicts/inc.yml', 'dicts/dec.yml', 'dicts/inv.yml'])
    dict_tagged_sentences = dicttagger.tag(pos_tagged_sentences)
    #print(dict_tagged_sentences)
    print(sentiment_score(dict_tagged_sentences))

    actionableScore = action_score(dict_tagged_sentences)

    #based on existing algorism
    opinion = TextBlob(reviewVar)
    print(opinion.sentiment)
    sentimentScore = opinion.sentiment.polarity
    subjectivity = opinion.sentiment.subjectivity
    
        #No Stopword Word Count
    for char in '-.,\n':
        Text=noStopwordsReviewVar.replace(char,' ')
    Text = Text.lower()
    word_list = Text.split()
    
    wordCount = (len(word_list))
    
    actionableScore = actionableScore/wordCount
    
    #round
    sentimentScore = round(sentimentScore,2)
    subjectivity = round(subjectivity,2)
    actionableScore = round(actionableScore,2)
    
    #insert into reviews 2
    SQLCommand = ("INSERT INTO reviews2(review, sentimentScore, subjectivity, actionableScore, positiveCount, negativeCount, actionableCount, wordCount, qType) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)")
    Values = [reviewVar,sentimentScore, subjectivity, actionableScore,positiveCount,negativeCount,actionableCount,wordCount, qTypeVar]
    mycursor.execute(SQLCommand,Values)
    conn.commit()
    print (reviewVar)
    print (sentimentScore)
    print (subjectivity)
    print (actionableScore)
    print (positiveCount)
    print (negativeCount)
    print (actionableCount)
    print (wordCount)
    print (qTypeVar)
    
    
    
    
















#Delete * from reviews 1

SQLCommand = ("Delete * from reviews1")
#mycursor.execute(SQLCommand)
#conn.commit()
mycursor.close()
if(conn.is_connected()):
    conn.close()
