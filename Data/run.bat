:: Hotel
python2 topics.py ./Model/model_base_hotel.dat ./Seeds/hotel_vocabulary_CHI.dat 25 > ./topics_groundtruth.dat
python2 topics.py ./Model/model_hotel.dat ./Seeds/hotel_vocabulary_CHI.dat 25 > ./topics_LRR.dat