# Neurosift

Interactive neuroscience visualizations in the browser.

Neurosift provides a platform for the creation, visualization, and sharing of complex neuroscience data straight from your web browser. It caters to both individual users through its local mode, allowing the processing of views directly from your device, as well as a remote access function for presenting your findings to other users on different machines. With Neurosift, you have the ability to construct a multitude of synchronized visuals such as spike raster plots, audio spectrograms, videos, video annotations, position decode fields, and timeseries graphs.

## Necessary System Specifications

* Operating Systems: Linux, Mac, or Windows
* Web Browsers: Chrome or Firefox
* Software: NodeJS v16 or higher

## Instructions for Installation and Setup

We suggest installing Neurosift within a conda environment or a virtual environment. For example, to create and activate a conda environment named neurosift:

```bash
conda create -n neurosift python=3.9
conda activate neurosift
```

**prerequisite**: Install [NodeJS v16 or higher](https://nodejs.org/en/download).

Clone the repository and install from source:

```bash
git clone https://github.com/scratchrealm/neurosift
cd neurosift/python
pip install -e .
```

Next, create a folder for your data and include some test files:

```bash
mkdir -p ~/rtcshare_data/test
cd ~/rtcshare_data/test
# transfer some data files into this test directory, these could be in .mp4, .avi, or .py formats
```

Share the data folder utilizing rtcshare:

```bash
cd ~/rtcshare_data
rtcshare start --dir .
# keep this terminal window running
```

Go to https://scratchrealm.github.io/neurosift in your web browser. From here, you should be able to navigate to the test directory and see your files. You can then click on the files to visualize them.

## Remote Access Capability

To make your visualizations remotely accessible, for instance, to share your work with colleagues, simply add the --enable-remote-access option to rtcshare:

```bash
cd ~/rtcshare_data
rtcshare start --dir . --enable-remote-access
```

Then you will need to modify the URL in your web browser to include the remote access server address. (TODO: explain how to do this)

## Visualizations

Here's a table

| Visualization | File types | Description |
| --- | --- | --- |
| [Audio spectrogram](./doc/audio_spectrogram.md) | .ns-asp | Audio spectrogram |
| [Composite figure](./doc/composite_figure.md) | .ns-fig | Composite figure of multiple visualizations in a custom layout |
| [Position decode field](./doc/position_decode_field.md) | .ns-pdf | Animal position decode field |
| [Spike raster plot](./doc/spike_raster_plot.md) | .ns-spt | Raster plot view of spike trains |
| [Timeseries annotation](./timeseries_annotation.md) | .ns-tsa | Annotation of a timeseries graph |
| [Timeseries graph](./doc/timeseries_graph.md) | .ns-tsg | Timeseries data in a scrollable time view |
| [Video](./doc/video.md) | .mp4, .avi | Video / movie |
| [Video annotation](./doc/video_annotation.md) | .ns-van | Annotation of a video |

## Contributing

We welcome feedback and code contributions. Please submit a pull request or open an issue.

## License

Neurosift is licensed under the terms of the Apache License 2.0.

## Authors

Jeremy Magland, Jeff Soules, and Ralph Peterson

Center for Computational Mathematics and Center for Computational Neuroscience, Flatiron Institute, Simons Foundation